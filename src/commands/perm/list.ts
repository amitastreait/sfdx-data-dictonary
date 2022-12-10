/* eslint-disable */
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { ObjectPermissions } from '../../scripts/objectPermissions';
import { FieldPermissions } from '../../scripts/fieldPermissions';

import excelUtil = require('../../utils/exportPermissions');
import reportUtil = require('../../utils/generateReports');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class List extends SfdxCommand {

    public static description = messages.getMessage('commandPermListDescription');

    public static examples = [`
    sfdx perm:list -u utils -o "Account" --json
    sfdx perm:list -u utils -o "Account"
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.html --format html
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.xlsx --format xlsx
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.xlsx
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.html
    `]

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        name: flags.string({
            char: 'n',
            description: messages.getMessage('fileNameFlagDescription'),
            required: true,
        }),
        object: flags.string({
            char: 'o',
            description: messages.getMessage('objFlagDescription'),
            required: true
        }),
        format: flags.string({
            char: 'p',
            description: messages.getMessage('formatFlagDescription'),
            required: false
        }),
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise<AnyJson> {
        const objectName = (this.flags.object || 'Account') as string;
        const fileName = (this.flags.name || 'ObjectPermissions.xlsx') as string;
        const reportFormat = (this.flags.format || 'html') as string;

        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

        // Query the org - const result = await conn.query<Account>(query);
        const objPermissions = await conn.query(`SELECT Id, Parent.Name, Parent.Type, SobjectType, PermissionsCreate, PermissionsRead, PermissionsEdit,
            PermissionsDelete, PermissionsViewAllRecords,
            PermissionsModifyAllRecords, CreatedBy.Name,
            LastModifiedBy.Name
            FROM ObjectPermissions
            WHERE sObjectType ='${objectName}'`
        );

        let result = objPermissions as ObjectPermissions;

        const fldPermissions = await conn.query(`SELECT Id, Parent.Name, Parent.Type, Field,
            PermissionsEdit, PermissionsRead, SobjectType
            FROM FieldPermissions
            Where
            sObjectType = '${objectName}' `
        );
        this.ux.log(`generating the permission reports in ${reportFormat}`)
        let fieldResult = fldPermissions as FieldPermissions;
        this.ux.startSpinner(`fetching metadata`);
        // Organization will always return one result, but this is an example of throwing an error The output and --json will automatically be handled for you.
        if (!result.records || result.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }

        if (!fieldResult.records || fieldResult.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }
        if(reportFormat === 'html'){
            reportUtil.generateHTMLReport(objectName, fileName, result, fieldResult, this );
            this.ux.log(`Object permissions has been written to ${fileName} file!`);
            this.ux.log(`Field permissions has been written to ${objectName}-FieldPermissions.html file!`);
        }else{
            excelUtil.createFile(fileName, result, fieldResult, this );
            this.ux.log(`Object permissions has been written to ${fileName}.`);
        }

        // Return an object to be displayed with --json
        this.ux.stopSpinner('');

        return { message : `Object permissions has been written ${fileName}.` };
    }
}
