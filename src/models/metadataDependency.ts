export interface MetadataComponentDependencyResult {
    size: number,
    totalSize: number,
    done: boolean,
    queryLocator: string,
    entityTypeName: string,
    records : Array<MetadataComponentDependency>
}

export interface MetadataComponentDependency{
    MetadataComponentName: string,
    MetadataComponentType: string,
    RefMetadataComponentName: string,
    RefMetadataComponentType: string
}