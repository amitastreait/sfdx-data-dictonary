/* eslint-disable */
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { ObjectPermissions, ProfileResponse } from '../../models/objectPermissions';
import { FieldPermissions } from '../../models/fieldPermissions';

import excelUtil = require('../../scripts/exportPermissions');
import reportUtil = require('../../scripts/generateReports');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class List extends SfdxCommand {

    public static description = messages.getMessage('commandPermListDescription');
    /*
        sfdx perm:list -u utils -o "Account" -n Account-ObjectPermissions.html --format html
        sfdx perm:list -u utils -o "Contact" -n Contact-ObjectPermissions.html --format html
        sfdx perm:list -u utils -o "Lead" -n Lead-ObjectPermissions.html --format html
        sfdx perm:list -u utils -o "Lead" -n Lead-ObjectPermissions.xlsx --format xlsx
    */
    public static examples = [`
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.html --format html
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.xlsx --format xlsx
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.html --touser username@org.com --format html
    sfdx perm:list -u utils -o "Account" -n ObjectPermissions.xlsx --touser username@org.com --format xlsx
    sfdx perm:list -u utils -n ObjectPermissions.xlsx --format xlsx
    sfdx perm:list -u utils -n ObjectPermissions.html --format html
    sfdx perm:list -u utils -n ObjectPermissions.html --format html --profile "System Administrator"
    sfdx perm:list -u utils -n ObjectPermissions.html --format html --permissionset "Permission Set"
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
            required: false
        }),
        format: flags.string({
            char: 'f',
            description: messages.getMessage('formatFlagDescription'),
            required: true
        }),
        touser: flags.string({
            char: 't',
            description: messages.getMessage('usrFlagDescription'),
            required: false
        }),
        profile: flags.string({
            char: 'p',
            description: messages.getMessage('profileFlagDescription'),
            required: false
        }),
        permissionset: flags.string({
            char: 's',
            description: messages.getMessage('permFlagDescription'),
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
        const objectName = (this.flags.object) as string;
        let fileName = (this.flags.name || `${objectName}-ObjectPermissions.xlsx`) as string;
        const reportFormat = (this.flags.format || 'html') as string;
        const userName = this.flags.touser as string;
        const profileName = this.flags.profile as string;
        const permissionSet = this.flags.permissionset as string;

        if(userName && profileName){
            throw new SfdxError( 'You can either specify --profile or --touser in the command but not both at the same time' );
        }

        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

        const WHERE_CLAUSE = ' WHERE ';
        this.ux.warn('We are continuously improving the product. Please let us know how do you feel about the product at https://github.com/amitastreait/sfdx-data-dictonary/issues');

        let objPermissionsQuery = `SELECT Id, Parent.Profile.Name, Parent.Label, Parent.Name, Parent.Type, SobjectType, PermissionsCreate, PermissionsRead, PermissionsEdit,
                PermissionsDelete, PermissionsViewAllRecords,
                PermissionsModifyAllRecords, CreatedBy.Name,
                LastModifiedBy.Name
                FROM ObjectPermissions
        `;

        let fieldPermissionsQuery = `SELECT Id, Parent.Profile.Name, Parent.Label, Parent.Name, Parent.Type, Field,
                PermissionsEdit, PermissionsRead, SobjectType
                FROM FieldPermissions
            `;

        //this.ux.log(` ${JSON.stringify(this.flags || {} )} `);
        if(profileName && permissionSet){
            throw new SfdxError( 'You can either specify profile or permission set in the command but not both' );
        }
        /* if(profileName && permissionSet){
            objPermissionsQuery += ` AND (
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Profile.Name = '${profileName}'
                )
                OR
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Label = '${permissionSet}'
                )
            ) `;
            fieldPermissionsQuery += ` AND (
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Profile.Name = '${profileName}'
                )
                OR
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Label = '${permissionSet}'
                )
            ) `;
        }*/
        this.ux.startSpinner(`fetching metadata`);
        if(profileName || permissionSet || userName || objectName){
            objPermissionsQuery += ` ${WHERE_CLAUSE} `
            fieldPermissionsQuery += ` ${WHERE_CLAUSE} `
        }

        let AND_CLAUSE = ``;

        if(objectName){
            objPermissionsQuery += ` sObjectType ='${objectName}' `
            fieldPermissionsQuery += ` sObjectType ='${objectName}' `
            AND_CLAUSE = ' AND ';
        }

        let ProfileNameToFilter = '';

        if(userName && !permissionSet){

            const pResponse = await conn.query(`SELECT ProfileId, Profile.Name FROM User WHERE Username = '${userName}' `);
            const ppResponse = pResponse as ProfileResponse;

            if(ppResponse && ppResponse.records && ppResponse.records.length>0 && ppResponse.records[0].Profile){
                ProfileNameToFilter = ` ${ppResponse.records[0].Profile.Name} `;
            }
            objPermissionsQuery += ` ${AND_CLAUSE} ParentId IN ( SELECT PermissionSetId FROM PermissionSetAssignment WHERE Assignee.Username = '${userName}' ) `;

            fieldPermissionsQuery += ` ${AND_CLAUSE} ParentId IN ( SELECT PermissionSetId FROM PermissionSetAssignment WHERE Assignee.Username = '${userName}' ) `;

        }else if(userName && permissionSet){
            objPermissionsQuery += ` ${AND_CLAUSE} ParentId IN ( SELECT PermissionSetId FROM PermissionSetAssignment WHERE Assignee.Username = '${userName}' AND PermissionSet.Name = '${permissionSet}' ) `;

            fieldPermissionsQuery += ` ${AND_CLAUSE} ParentId IN ( SELECT PermissionSetId FROM PermissionSetAssignment WHERE Assignee.Username = '${userName}' AND PermissionSet.Name = '${permissionSet}' ) `;
        }

        const PROFILE_FILTER = ` ${WHERE_CLAUSE} (
            ParentId IN (
                SELECT Id
                FROM PermissionSet
                WHERE PermissionSet.Profile.Name = '${ProfileNameToFilter}'
            )
        ) `;

        if(profileName ){
            objPermissionsQuery += ` ${AND_CLAUSE} (
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Profile.Name = '${profileName}'
                )
            ) `;
            fieldPermissionsQuery += ` ${AND_CLAUSE} (
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Profile.Name = '${profileName}'
                )
            ) `;
        }else if(permissionSet && !userName){
            objPermissionsQuery += ` ${AND_CLAUSE} (
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Label = '${permissionSet}'
                )
            ) `;
            fieldPermissionsQuery += ` ${AND_CLAUSE} (
                ParentId IN (
                    SELECT Id
                    FROM PermissionSet
                    WHERE PermissionSet.Label = '${permissionSet}'
                )
            ) `;
        }

        //this.ux.log(objPermissionsQuery);
        const objPermissions = await conn.query(`${objPermissionsQuery}`);

        let result = objPermissions as ObjectPermissions;

        const fldPermissions = await conn.query(`${fieldPermissionsQuery}`);
        //this.ux.log(fieldPermissionsQuery);
        this.ux.log(`generating the permission matrix in ${reportFormat}`)
        let fieldResult = fldPermissions as FieldPermissions;

        let nextRecordsUrl = fieldResult.nextRecordsUrl
        while(nextRecordsUrl){
            this.ux.log(`hang-on tight we are baking the matrix for you...`)
            const fldPermissionsNextPage = await conn.request(`${nextRecordsUrl}`);
            const fieldResultNextRecord = fldPermissionsNextPage as FieldPermissions;
            if (fieldResultNextRecord.records && fieldResultNextRecord.records.length > 0) {

                fieldResultNextRecord.records.forEach( perm => {
                    fieldResult.records.push( perm );
                });
                if(fieldResultNextRecord.nextRecordsUrl){
                    nextRecordsUrl = fieldResultNextRecord.nextRecordsUrl;
                }else{
                    nextRecordsUrl = '';
                }
            }
        }

        if(ProfileNameToFilter){

            let subQuery = objPermissionsQuery.substring(0, objPermissionsQuery.indexOf('WHERE') );
            subQuery += PROFILE_FILTER;
            let subQueryField = fieldPermissionsQuery.substring(0, fieldPermissionsQuery.indexOf('WHERE') );
            subQueryField += PROFILE_FILTER;

            const objPermissionsUser = await conn.query(`${subQuery}`);
            let resultUser = objPermissionsUser as ObjectPermissions;
            if (resultUser.records && resultUser.records.length > 0) {
                resultUser.records.forEach( perm => {
                    result.records.push( perm );
                });
            }
            const fldPermissionsUser = await conn.query(`${subQueryField}`);
            let fieldResultUser = fldPermissionsUser as FieldPermissions;
            if (fieldResultUser.records && fieldResultUser.records.length > 0) {
                fieldResultUser.records.forEach( perm => {
                    fieldResult.records.push( perm );
                });
            }
        }
        /*if (!result.records || result.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }

        if (!fieldResult.records || fieldResult.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }*/

        if(reportFormat === 'html'){

            let fieldPermissionsName = `${objectName}-FieldPermissions.html`;
            let headingTitle = `This report was generated using sfdx perm:list -u ${conn.getUsername()} `;
            let finalFileName = '';
            if(objectName){
                headingTitle += `--object ${objectName} `;
                finalFileName = `${objectName}-${fileName}`;
            }

            if(userName){
                fieldPermissionsName = `${userName}-FieldPermissions.html`;
                finalFileName = `${userName}-ObjectPermissions.html`;
                headingTitle += `--touser ${userName} `
            }

            if(finalFileName){
                headingTitle += `--name ${finalFileName} `;
            }

            headingTitle += `--format ${reportFormat} command`;

            reportUtil.generateHTMLReport(objectName, finalFileName, result, fieldResult, this, headingTitle, fieldPermissionsName);
            this.ux.log(`Object permissions has been written to ${finalFileName} file!`);
            this.ux.log(`Field permissions has been written to ${fieldPermissionsName} file!`);
        }else{
            let finalFileName = '';
            if(objectName){
                finalFileName = `${objectName}-${fileName}`;
            }
            excelUtil.createFile(finalFileName, result, fieldResult, this );
            this.ux.log(`Object permissions has been written to ${fileName}.`);
        }

        this.ux.stopSpinner('');

        return { message : `Object permissions has been written ${fileName}.` };
    }
}
