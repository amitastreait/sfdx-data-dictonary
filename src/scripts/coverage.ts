export interface TestCoverageResponse{
    size: number;
    totalSize: number;
    done: boolean;
    queryLocator: string;
    entityTypeName: string;
    records: Array<Records>
}

interface Records{
    ApexTestClassId: string;
    NumLinesCovered: number;
    NumLinesUncovered: number;
    Coverage: Coverage;
    ApexClassOrTrigger: ApexClassOrTrigger;
}

interface Coverage{
    coveredLines: number[];
    uncoveredLines: number[];
}

interface ApexClassOrTrigger{
    Name: string;
}

export interface CodeCoveragetable {
    ApexClassOrTrigger: string;
    NumLinesCovered: number;
    NumLinesUncovered: number;
    Percentage?: string
}