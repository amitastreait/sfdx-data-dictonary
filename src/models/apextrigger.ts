export interface ApexTriggerResult{
    totalSize: number;
    done: boolean;
    records: Array<ApexTrigger>
}

export interface ApexTrigger {
    Id: string;
    NamespacePrefix: string;
    Name: string;
    TableEnumOrId: string;
    ApiVersion: number;
    Status: string;
    IsValid: boolean;
    CreatedDate: Date;
    LastModifiedDate: Date;
}