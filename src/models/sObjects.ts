import { Flow } from './flow';
import { ValidationRule } from './validationrule';
import { ApexTrigger } from './apextrigger';
/* eslint-disable*/
export interface dependentPicklLists{
    objectName : string;
    controllingFieldName : string;
    controllingValue: string;
    dependentFieldName: string;
    dependentValue : string;
    isActive : boolean;
}

interface sObject {
    activateable: boolean;
    createable: boolean;
    custom: boolean;
    customSetting: boolean;
    deletable: boolean;
    deprecatedAndHidden: boolean;
    feedEnabled: boolean;
    hasSubtypes: boolean;
    isSubtype: boolean;
    keyPrefix: string;
    label: string;
    labelPlural: string;
    layoutable: boolean;
    mergeable: boolean;
    mruEnabled: boolean;
    name: string;
    queryable: boolean;
    replicateable: boolean;
    retrieveable: boolean;
    searchable: boolean;
    triggerable: boolean;
    undeletable: boolean;
}

interface fieldInfo{
    label : string;
    name : string;
    custom : boolean;
    inlineHelpText : string ;
    calculatedFormula : string;
    length : number ;
    type : string;
    unique : string ;
    precision : number;
    scale : number;
    encrypted : boolean;
    externalId : boolean;
    picklistValues:Array<pickList>;
    updateable: boolean;
    nillable : boolean;
    createable: boolean;
    aggregatable : boolean;
    aiPredictionField : boolean;
    autoNumber : boolean;
    calculated : boolean;
    restrictedPicklist : boolean;
    referenceTo : Array<String>;
    controllerName : string;
}

export interface FieldDefinitionResult{
    totalSize: number;
    done : boolean;
    records : Array<FieldDefinition>;
}
interface FieldDefinition{
    Description? : string;
    ComplianceGroup? : string;
    BusinessOwnerId? : string;
    BusinessStatus? : string;
    SecurityClassification? : string;
    BusinessOwner? : BusinessOwner;
    QualifiedApiName? : string;
}

interface BusinessOwner {
    Name: string;
}

export interface pickList{
    label : string;
    value : string;
    active: boolean;
    defaultValue: string;
    validFor:string;
}

export interface objectDesc{
    name        : string;
    fields      : Array<fieldInfo>;
    validations : Array<ValidationRule>
    flows       : Array<Flow>
    triggers    : Array<ApexTrigger>
}

export interface sobjectRes{
    encoding:string;
    maxBatchSize : number;
    sobjects : Array<sObject>;
}