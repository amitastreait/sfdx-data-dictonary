/* eslint-disable */

import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

/* Import the utilities */
import { objectDesc, sobjectRes, FieldDefinitionResult } from '../../models/sObjects';
import { ValidationRuleResult, ValidationRule } from '../../models/validationrule';
import { FlowResult, Flow } from '../../models/flow';
import { ApexTriggerResult, ApexTrigger} from '../../models/apextrigger';

/* import the object of exportFile so that Excel Sheet can be created */
import excelUtil = require('../../scripts/exportFile');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Dictionary extends SfdxCommand {

    public static description = messages.getMessage('commandDataDictonaryDescription');

    public static examples = [`
        sfdx data:dictonary -u yourorg@salesforec.com --objects "Account,Lead" -p "./path/to/file/file.xlsx"
        sfdx data:dictonary -u yourorg@salesforec.com --objects "Account,Lead"
        sfdx data:dictonary -u yourorg@salesforec.com --objects "Account,Lead" --json
        sfdx data:dictonary -u yourorg@salesforec.com
    `];

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        path :  flags.string({
            char: 'p',
            description: messages.getMessage('pathFlagDescription')
        }),
        objects : flags.string({
            char: 'o',
            description: messages.getMessage('objectFlagDescription')
        }),
        type : flags.string({
            char: 't',
            description: 'Ditermines the type of object. Valid values are Custom and Standard. Custom also includes metadata, custom settings and external objects'
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
        const objectType = this.flags.type  ;
        const filePath = this.flags.path || "Object-Infos.xlsx" ;

        if(!objects && !objectType){
            throw new SfdxError( ` Please provide either --objects or --type parameter in the command `);
        }

        const excludeObject = [
            'FeedItem', 'FeedComment', 'FeedLike', 'FeedVote', 'ContentDocument', 'ApexTestRunResult', 'ApexTestSuite', 'ApexTypeImplementor', 'AsyncOperationEvent',
            'AsyncOperationStatus', 'AttachedContentDocument','AttachedContentNote','Audience','AuraDefinitionBundle','AuraDefinitionBundleInfo','AuraDefinitionInfo',
            'AuthConfig','AuthConfigProviders','AuthProvider','AuthSession','AuthorizationForm',
            'ListViewEvent', 'LiveChatButton','LiveChatDeployment', 'MLField', 'MLModel', 'MLModelFactor', 'ApexTestResultLimits', 'AppMenuItem', 'AppTabMember',
            'Idea', 'IdeaComment', 'ListEmail', 'LoginEvent', 'LoginEventStream', 'LoginIp', 'LoginIpRange', 'Organization','ApexTestResult', 'Approval', 'AssetRelationship',
            'PackageLicence', 'Partner', 'PermissionSet', 'PermissionSetAssignment', 'PermissionSetEvent', 'Prompt', 'PromptAction', 'ApexPageInfo', 'ApexTestQueueItem',
            'SearchActivity', 'SearchLayout', 'StaticResource', 'ApexPage','ApexTrigger', 'ApexComponent', 'ApexLog', 'ApexEmailNotification', 'TaskGroup', 'AccountContactRole', 'AggregateResult', 'AdditionalNumber'
        ];

        const includeObject = [
            'Account', 'Contact', 'Case', 'Lead', 'Opportunity', 'Product2', 'Order', 'Quote', 'OpportunityLineItem', 'OrderLineItem', 'QuoteLineItem',
            'Task', 'Event', 'Campaign'
        ];

        const classificationMap = {};
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
                this.ux.warn(`You have not specified --objects parameter, the command will fetch few standard object & all custom object metadata details! `);
                const objNameResult = await conn.request('/services/data/v55.0/sobjects');
                let sObjectRef = objNameResult as sobjectRes;
                for(var i=0;i<sObjectRef.sobjects.length;i++){
                    let objectApiName = sObjectRef.sobjects[i].name;
                    let isCustom = sObjectRef.sobjects[i].custom;
                    let isCustomSetting = sObjectRef.sobjects[i].customSetting;
                    if( !objectApiName.endsWith('Share') && !objectApiName.endsWith('ChangeEvent') && !objectApiName.endsWith('Feed')
                        && !objectApiName.endsWith('History') && !objectApiName.endsWith('Tag') && !objectApiName.endsWith('Template')
                        && !objectApiName.endsWith('Metric') && !objectApiName.endsWith('Limits') && !objectApiName.endsWith('Definition') 
                        && !objectApiName.endsWith('Job') && !objectApiName.endsWith('Location') 
                        && !objectApiName.endsWith('Member') && !objectApiName.endsWith('TokenEvent') && !objectApiName.endsWith('Rule') 
                        && !excludeObject.includes( objectApiName ) && ( 
                            includeObject.includes( objectApiName ) || isCustom || isCustomSetting
                        )
                        && objectApiName.lastIndexOf('__') === objectApiName.indexOf('__')
                    ){
                        objNames.push(sObjectRef.sobjects[i].name);
                    }
                }
            }catch(e){
                this.ux.log(` Error encountered while trying to get object names. Possibilities of invalid API version. Error - ${e.message}`);
                throw new SfdxError( ` ${e.message} `);
            }
        }

        for(var i =0 ; i< objNames.length; i++){
            this.ux.log('Getting Field Metadata for : '+objNames[i]+' Object.');
            try{
                let fldResult = await conn.request('/services/data/v55.0/sobjects/'+objNames[i].trim()+'/describe');
                var objRes    = fldResult as objectDesc;
                
                const validationRuleQuery   = `Select Id, ValidationName, Description,
                    EntityDefinition.DeveloperName, ErrorDisplayField,
                    ErrorMessage, Active FROM ValidationRule
                    WHERE EntityDefinition.DeveloperName = '${objNames[i]}'
                `;

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
                
                const flowResult = await conn.request(`/services/data/v56.0/query?q=${flowQuery}`);
                let flow_Results = flowResult as FlowResult;
                let flows = flow_Results.records as Flow[];
                objRes.flows = flows;

                const apexTriggerQuery = `SELECT Id, NamespacePrefix, Name,
                    TableEnumOrId, ApiVersion, Status,
                    IsValid, CreatedDate, LastModifiedDate
                    FROM ApexTrigger
                    WHERE TableEnumOrId = '${objNames[i].trim()}'
                `;
                
                const triggerResult = await conn.request(`/services/data/v56.0/query?q=${apexTriggerQuery}`);
                let trigger_Results = triggerResult as ApexTriggerResult;
                let triggers = trigger_Results.records as ApexTrigger[];

                objRes.triggers = triggers;

                const dataClassificationQuery = `SELECT Id, QualifiedApiName, DeveloperName, ComplianceGroup, Description, BusinessOwnerId,
                    BusinessOwner.Name, BusinessStatus, SecurityClassification
                    FROM FieldDefinition
                    WHERE EntityDefinition.QualifiedApiName IN ('${objNames[i]}')
                `;
                const classificationResult = await conn.request(`/services/data/v56.0/query?q=${dataClassificationQuery}`);
                const dataClassResult = classificationResult as FieldDefinitionResult;
                dataClassResult.records.forEach( field => {
                    classificationMap[field.QualifiedApiName] = field ;
                });

                combinedMetadata.push(objRes);
            }catch(e){
                this.ux.log(`Error while fetching object - ${objNames[i]} , Message - ${e.message} `);
                throw new SfdxError( `Error while fetching object - ${objNames[i]} , Message - ${e.message} `);
            }
        }

        excelUtil.createFile(filePath, combinedMetadata, this, classificationMap);
        this.ux.log('Excel File created at - '+filePath);
        this.ux.stopSpinner('Export Completed');
        return { message : `Excel File created at - ${filePath} `};
    }
}