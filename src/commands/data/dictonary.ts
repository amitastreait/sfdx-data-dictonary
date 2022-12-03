/* eslint-disable */

import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

/* Import the utilities */
import { objectDesc, sobjectRes } from '../../scripts/utils';
import { ValidationRuleResult, ValidationRule } from '../../scripts/validationrule';
import { FlowResult, Flow } from '../../scripts/flow';
import { ApexTriggerResult, ApexTrigger} from '../../scripts/apextrigger';

/* import the object of exportFile so that Excel Sheet can be created */
import excelUtil = require('../../scripts/exportFile');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Dictionary extends SfdxCommand {
public static description = messages.getMessage('commandDescription');

public static examples = [`

    sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead" -p "/path/to/file/file.xlsx"

    sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead"

`];

public static args = [{ name: 'file' }];

protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
        char: 'n',
        description: messages.getMessage('nameFlagDescription'),
    }),
    force: flags.boolean({
        char: 'f',
        description: messages.getMessage('forceFlagDescription'),
    }),
    path :  flags.string({
        char: 'p',
        description: messages.getMessage('pathFlagDescription')
    }),
    objects : flags.string({
        char: 'o',
        description: messages.getMessage('objectFlagDescription')
    }),
};

// Comment this out if your command does not require an org username
protected static requiresUsername = true;

// Comment this out if your command does not support a hub org username
protected static supportsDevhubUsername = true;

// Set this to true if your command requires a project workspace; 'requiresProject' is false by default
protected static requiresProject = false;

    public async run(): Promise<AnyJson> {
        //const name = (this.flags.name || 'world') as string;
        const objects = this.flags.objects  ;
        const filePath = this.flags.path || "Object-Infos.xlsx" ;
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

        var combinedMetadata = new Array<objectDesc>();
        let objNames = new Array<String>();
        this.ux.startSpinner('fetching metadata');

        if(objects){
            var objectContext = objects.split(',');
            objectContext.forEach(element => {
                objNames.push(element);
            });
        }else{
            try{
                const objNameResult = await conn.request('/services/data/v55.0/sobjects');
                let sObjectRef = objNameResult as sobjectRes;
                for(var i=0;i<sObjectRef.sobjects.length;i++){
                    objNames.push(sObjectRef.sobjects[i].name);
                }
            }catch(e){
                this.ux.log(` Error encountered while trying to get object names. Possibilities of invalid API version. Error - ${e.message}`);
                throw new SfdxError( ` ${e.message} `);
            }
        }

        //
        //this.ux.startSpinner('Exporting metadata ');
        for(var i =0 ; i< objNames.length; i++){
            this.ux.log('Getting Field Metadata for : '+objNames[i]+' Object.');
            try{
                let fldResult = await conn.request('/services/data/v55.0/sobjects/'+objNames[i].trim()+'/describe');
                var objRes    = fldResult as objectDesc;
                this.ux.log('Getting validation rule for : '+objNames[i]);
                const validationRuleQuery   = `Select Id, ValidationName, Description,
                    EntityDefinition.DeveloperName, ErrorDisplayField,
                    ErrorMessage, Active FROM ValidationRule
                    WHERE EntityDefinition.DeveloperName = '${objNames[i]}'
                `;
                //this.ux.log(` validationRuleQuery => ${validationRuleQuery} `);
                const validationRuleResults = await conn.request(`/services/data/v56.0/tooling/query?q=${validationRuleQuery}`);
                let results = validationRuleResults as ValidationRuleResult;
                let validations    = results.records as ValidationRule[];
                objRes.validations = validations;

                const flowQuery = `SELECT ApiName, Label, Description, ProcessType,
                    TriggerType, LastModifiedBy, IsActive,
                    LastModifiedDate, TriggerOrder FROM FlowDefinitionView
                    WHERE ProcessType IN ('Flow', 'AutoLaunchedFlow')
                    AND TriggerObjectOrEvent.DeveloperName = '${objNames[i].trim()}'
                `;
                this.ux.log('Getting record triggered flows for : '+objNames[i]);
                const flowResult = await conn.request(`/services/data/v56.0/query?q=${flowQuery}`);
                let flow_Results = flowResult as FlowResult;
                let flows = flow_Results.records as Flow[];
                objRes.flows = flows;
                //this.ux.log(` flows => ${JSON.stringify( flows || {} )}`);
                const apexTriggerQuery = `SELECT Id, NamespacePrefix, Name,
                    TableEnumOrId, ApiVersion, Status,
                    IsValid, CreatedDate, LastModifiedDate
                    FROM ApexTrigger
                    WHERE TableEnumOrId = '${objNames[i].trim()}'
                `;
                this.ux.log('Getting Apex Triggers for : '+objNames[i]);
                const triggerResult = await conn.request(`/services/data/v56.0/query?q=${apexTriggerQuery}`);
                let trigger_Results = triggerResult as ApexTriggerResult;
                let triggers = trigger_Results.records as ApexTrigger[];
                //this.ux.log(` Apex Triggers => ${JSON.stringify(triggers || {} )}`);
                objRes.triggers = triggers;

                combinedMetadata.push(objRes);
            }catch(e){
                this.ux.log(`Error while fetching object - ${objNames[i]} , Message - ${e.message} `);
                throw new SfdxError( `Error while fetching object - ${objNames[i]} , Message - ${e.message} `);
            }
        }

        //this.ux.log(JSON.stringify(combinedMetadata) );
        excelUtil.createFile(filePath, combinedMetadata, this);
        this.ux.log('Excel File created at - '+filePath);
        this.ux.stopSpinner('Export Completed');
        //this.ux.startSpinner('fetching metadata...');
        return { message : `Excel File created at - ${filePath} `};
    }
}