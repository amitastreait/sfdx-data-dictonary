export interface FlowResult{
    totalSize: number;
    done: boolean;
    records: Array<Flow>
}

export interface Flow {
    ApiName: string;
    Label: string;
    Description: string;
    ProcessType: string;
    TriggerType: string;
    LastModifiedBy: string;
    IsActive: boolean;
    LastModifiedDate: Date;
    TriggerOrder: number;
}