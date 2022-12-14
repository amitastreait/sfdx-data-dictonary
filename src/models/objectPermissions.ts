export interface ObjectPermissions{
    totalSize: number;
    done: boolean;
    records : Array<ObjectPermission>
}

export interface ObjectPermission{
    Id: string;
    Parent: Parent;
    SobjectType: string;
    PermissionsCreate: boolean;
    PermissionsRead: boolean;
    PermissionsEdit: boolean;
    PermissionsDelete: boolean;
    PermissionsViewAllRecords: boolean;
    PermissionsModifyAllRecords: boolean;
}

interface Parent {
    Name: string;
    Type: string;
    Profile: Profile
}

export interface ProfileResponse{
    totalSize: number;
    done: boolean;
    records: Array<Response>
}

interface Response{
    ProfileId: string;
    Profile: Profile
}

interface Profile{
    ProfileId: string;
    Name: string;
}