/* eslint-disable*/
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

import { objectDesc } from '../../models/sObjects';
import excelUtil = require('../../scripts/exportFieldUsage');

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
        this.ux.warn('We are continuously improving the product. Please let us know how do you feel about the product at https://github.com/amitastreait/sfdx-data-dictonary/issues');
        let countQuery = `SELECT `;
        this.ux.startSpinner('fetching field usage');
        let totalLength = 0;
        try{
            let fldResult = await conn.request('/services/data/v55.0/sobjects/'+objectName.trim()+'/describe');
            var objRes    = fldResult as objectDesc;
            totalLength = objRes.fields.length;

            if(totalLength< 100){
                for(var i = 0; i< totalLength; i++){
                    let nillable = objRes.fields[i].nillable;
                    if( objRes.fields[i].type !== 'textarea'
                        && objRes.fields[i].type !== 'address'
                        //&& objRes.fields[i].type !== 'reference'
                        && objRes.fields[i].type !== 'multipicklist'
                        && objRes.fields[i].type !== 'location'
                        && objRes.fields[i].type !== 'time'
                        && !objRes.fields[i].encrypted
                        && nillable
                        && !objRes.fields[i].calculatedFormula
                        && !excludeFields.includes(objRes.fields[i].name)
                    ){
                        countQuery += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                    }
                }
            }else if(totalLength > 100){
                for(var i = 0; i< 100; i++){
                    let nillable = objRes.fields[i].nillable;
                    if( objRes.fields[i].type !== 'textarea'
                        && objRes.fields[i].type !== 'address'
                        && objRes.fields[i].type !== 'multipicklist'
                        //&& objRes.fields[i].type !== 'reference'
                        && objRes.fields[i].type !== 'time'
                        && objRes.fields[i].type !== 'location'
                        && !objRes.fields[i].encrypted
                        && nillable
                        && !objRes.fields[i].calculatedFormula
                        && !excludeFields.includes(objRes.fields[i].name)
                    ){
                        countQuery += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                    }
                }
            }

        }catch(e){
            this.ux.log(`Error while fetching object - ${objectName} , Message - ${e.message} `);
            throw new SfdxError( `Error while fetching object - ${objectName} , Message - ${e.message} `);
        }
        countQuery = countQuery.substring(0, countQuery.lastIndexOf(','));
        countQuery += ` FROM ${objectName} `;
        //this.ux.log(` Count Query  ${countQuery } `);

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
        let query200 = ``;
        if( (totalLength > 100 && totalLength >200) ){
            this.ux.log(`hang on tight, we are fetching the field usage .`)
            query200 = `SELECT `;
            for(var i = 100; i< 200; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    //&& objRes.fields[i].type !== 'reference'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && objRes.fields[i].type !== 'location'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query200 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }else if(totalLength > 100 && totalLength <200){
            query200 = `SELECT `;
            for(var i = 0; i< totalLength; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    //&& objRes.fields[i].type !== 'reference'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && objRes.fields[i].type !== 'location'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query200 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }

        if(query200){
            query200 = query200.substring(0, query200.lastIndexOf(','));
            query200 += ` FROM ${objectName} `;
            //this.ux.log(query200);
            const recordCountResult200 = await conn.query(query200);
            let counterRecords200 = recordCountResult200.records[0];
            for (let key in counterRecords200 ) {
                counterRecords[key] = counterRecords200[key];
            }
        }

        let query300 = ``;
        if( (totalLength > 200 && totalLength >300) ){
            query300 = `SELECT `;
            for(var i = 200; i< 300; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    //&& objRes.fields[i].type !== 'reference'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && objRes.fields[i].type !== 'location'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query300 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }else if(totalLength > 200 && totalLength <300){
            query300 = `SELECT `;
            for(var i = 200; i< totalLength; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    //&& objRes.fields[i].type !== 'reference'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && objRes.fields[i].type !== 'location'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query300 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }

        if(query300){
            query300 = query300.substring(0, query300.lastIndexOf(','));
            query300 += ` FROM ${objectName} `;
            //this.ux.log(query300);
            const recordCountResult300 = await conn.query(query300);
            let counterRecords300 = recordCountResult300.records[0];
            for (let key in counterRecords300 ) {
                counterRecords[key] = counterRecords300[key];
            }
        }
        let query400 = ``;
        if( (totalLength > 300 && totalLength >400) ){
            query400 = `SELECT `;
            for(var i = 300; i< 400; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && objRes.fields[i].type !== 'location'
                    //&& objRes.fields[i].type !== 'reference'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query400 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }else if(totalLength > 300 && totalLength <400){
            query400 = `SELECT `;
            for(var i = 300; i< totalLength; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && objRes.fields[i].type !== 'location'
                    //&& objRes.fields[i].type !== 'reference'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query400 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }
        if(query400){
            query400 = query400.substring(0, query400.lastIndexOf(','));
            query400 += ` FROM ${objectName} `;
            //this.ux.log(query400);
            const recordCountResult400 = await conn.query(query400);
            let counterRecords400 = recordCountResult400.records[0];
            for (let key in counterRecords400 ) {
                counterRecords[key] = counterRecords400[key];
            }
        }
        let query500 = ``;
        if( (totalLength > 400 ) ){
            query500 = `SELECT `;
            for(var i = 400; i< totalLength; i++){
                let nillable = objRes.fields[i].nillable;
                if( objRes.fields[i].type !== 'textarea'
                    && objRes.fields[i].type !== 'address'
                    && objRes.fields[i].type !== 'location'
                    //&& objRes.fields[i].type !== 'reference'
                    && objRes.fields[i].type !== 'multipicklist'
                    && objRes.fields[i].type !== 'time'
                    && !objRes.fields[i].encrypted
                    && nillable
                    && !objRes.fields[i].calculatedFormula
                    && !excludeFields.includes(objRes.fields[i].name)
                ){
                    query500 += ` count(${objRes.fields[i].name}) ${objRes.fields[i].name} , `
                }
            }
        }
        if(query500){
            query500 = query500.substring(0, query500.lastIndexOf(','));
            query500 += ` FROM ${objectName} `;
            //this.ux.log(query500);
            const recordCountResult500 = await conn.query(query500);
            let counterRecords500 = recordCountResult500.records[0];
            for (let key in counterRecords500 ) {
                counterRecords[key] = counterRecords500[key];
            }
        }
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