/* eslint-disable*/
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

import { objectDesc } from '../../scripts/utils';
import excelUtil = require('../../utils/exportFieldUsage');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core, or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Usage extends SfdxCommand {
    public static description = messages.getMessage('commandFieldUsageDescription');

    public static examples =[`
        sfdx field:usage -u username-alias --object "Account"
        sfdx field:usage -u username-alias --object "Account" --path "./path/to/report/folder/FieldUsage.xlsx"
        sfdx field:usage -u username-alias --object "Account" --path "FieldUsage.xlsx"
    `]

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        object: flags.string({
            char: 'o',
            description: messages.getMessage('objFlagDescription'),
            required: true
        }),
        path: flags.string({
            char: 'p',
            description: messages.getMessage('pthFlagDescription'),
        }),
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise<AnyJson> {
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();
        const objectName = this.flags.object;
        const fileName = (this.flags.path || `${objectName}-Field-Usage.xlsx`) as string;
        const query = `Select count(Id) TotalRecords FROM ${objectName}`;

        if(!objectName){
            throw new SfdxError( ` Please provide the valid object api name `);
        }

        const excludeFields = ['Id', 'IsDeleted', 'MasterRecordId', 'RecordTypeId' , 'BillingGeocodeAccuracy',
            'BillingAddress', 'ShippingGeocodeAccuracy', 'ShippingAddress', 'CreatedDate', 'CreatedById',
            'LastModifiedDate', 'LastModifiedById','SystemModstamp','LastActivityDate' ,'LastViewedDate','LastReferencedDate',
            'IsPartner', 'OwnerId', 'IsCustomerPortal'
        ];
        let countQuery = `SELECT `;
        this.ux.startSpinner('fetching field usage');
        try{
            let fldResult = await conn.request('/services/data/v55.0/sobjects/'+objectName.trim()+'/describe');
            var objRes    = fldResult as objectDesc;
            for(var i = 0; i< objRes.fields.length; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'reference'
                    && objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    && objRes.fields[i].type !== 'reference'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    countQuery += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }catch(e){
            this.ux.log(`Error while fetching object - ${objectName} , Message - ${e.message} `);
            throw new SfdxError( `Error while fetching object - ${objectName} , Message - ${e.message} `);
        }
        countQuery = countQuery.substr(0, countQuery.lastIndexOf(','));
        countQuery += ` FROM ${objectName} `;
        //this.ux.log(` Count Query \n ${countQuery } `);

        // Query the org
        const result = await conn.query(query);

        if (!result.records || result.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }
        let totalRecords:number = result.records[0]["TotalRecords"];
        this.ux.log(`Total number of records for ${objectName} are ${totalRecords} `);

        const recordCountResult = await conn.query(countQuery);

        if (!recordCountResult.records || recordCountResult.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }
        let counterRecords = recordCountResult.records[0];
        /*
            this.ux.log( JSON.stringify(counterRecords ) );
            for (let key in counrRecords ) {
                let val:number = counrRecords[key];
                let percent = (val/totalRecords).toFixed(4);
            }
        */

        excelUtil.createFile(fileName, counterRecords, this, totalRecords);
        this.ux.log(`Field Usage written in ${fileName}`);
        this.ux.stopSpinner('');
        // Return an object to be displayed with --json
        return { orgId: this.org.getOrgId() };
    }
}