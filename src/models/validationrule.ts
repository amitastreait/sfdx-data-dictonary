export interface ValidationRuleResult {
    size: number;
    totalSize: number;
    done: boolean;
    queryLocator: string;
    records: Array<ValidationRule>
}

export interface ValidationRule {
    ValidationName: string;
    Description: string;
    ErrorDisplayField: string;
    ErrorMessage: string;
    Active: boolean;
    EntityDefinition: EntityDefinition;
}

interface EntityDefinition{
    DeveloperName: string;
}