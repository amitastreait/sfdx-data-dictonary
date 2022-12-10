export interface FieldPermissions {
    totalSize: number;
    done: boolean;
    nextRecordsUrl: string;
    records : Array<FieldPermission>
}

export interface FieldPermission {
    Id: string;
    Parent: Parent;
    SobjectType: string;
    Field: string;
    PermissionsEdit: boolean;
    PermissionsRead: boolean;
}


interface Parent {
    Name: string;
    Type: string;
}