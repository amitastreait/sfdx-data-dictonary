var xl = require('excel4node');
import { ObjectPermissions } from '../scripts/objectPermissions';
import { FieldPermissions } from '../scripts/fieldPermissions';
var headerStyle = null;
export async function createFile(fileName, objPermissions : ObjectPermissions , fldPermissions : FieldPermissions, context) {
    var wb = new xl.Workbook();
    headerStyle = wb.createStyle({
        font: {
            color: '#FFFFFF',
            size: 12
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#38761d'
        }
    });

    ObjectPermissionTab(wb, objPermissions);
    FieldPermissionTab(wb, fldPermissions);
    wb.write(fileName);

}

function ObjectPermissionTab(wb, objPermissions : ObjectPermissions ){

    var ws_ObjectPermissions = wb.addWorksheet("Object Permissions");
    let headers: String[] = ['Profile/Permission Set Name', 'Parent Type', 'sObject Name', 'PermissionsCreate', 'PermissionsRead',
        'PermissionsEdit', 'PermissionsDelete', 'PermissionsViewAllRecords', 'PermissionsModifyAllRecords'
    ];

    addHeader(ws_ObjectPermissions, headers, 1, headerStyle);
    var rowNum = 2;
    objPermissions.records.forEach( perm => {

        let typeText = perm.Parent ? perm.Parent.Type : "";
        let parentName = perm.Parent ? perm.Parent.Name : "";
        if(perm.Parent && perm.Parent.Profile && perm.Parent.Profile.Name){
            parentName = perm.Parent.Profile.Name;
        }
        if(typeText === 'Regular'){
            typeText = 'Permission Set'
        }else if(typeText === 'Group'){
            typeText = 'Permission Set Group'
        }

        ws_ObjectPermissions.cell(rowNum, 1 ).string( parentName ) ;
        ws_ObjectPermissions.cell(rowNum, 2 ).string( typeText ) ;
        ws_ObjectPermissions.cell(rowNum, 3 ).string( perm.SobjectType ) ;
        ws_ObjectPermissions.cell(rowNum, 4 ).string( perm.PermissionsCreate ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 5 ).string( perm.PermissionsRead ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 6 ).string( perm.PermissionsEdit ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 7 ).string( perm.PermissionsDelete ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 8 ).string( perm.PermissionsViewAllRecords ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 9 ).string( perm.PermissionsModifyAllRecords ? "✔️" : "" ) ;
        rowNum++;
    });

}

function FieldPermissionTab(wb, fldPermissions : FieldPermissions ){
    var ws_FieldPermission = wb.addWorksheet("Field Permissions Coverage");
    let headers: String[] = ['Profile/Permission Set Name', 'Parent Type','sObject Name', 'Field', 'PermissionsEdit', 'PermissionsRead', 'SobjectType' ];

    addHeader(ws_FieldPermission, headers, 1, headerStyle);

    var rowNum = 2;

    fldPermissions.records.forEach( perm => {

        let typeText = perm.Parent ? perm.Parent.Type : "";
        let parentName = perm.Parent ? perm.Parent.Name : "";
        if(perm.Parent && perm.Parent.Profile && perm.Parent.Profile.Name){
            parentName = perm.Parent.Profile.Name;
        }
        if(typeText === 'Regular'){
            typeText = 'Permission Set'
        }else if(typeText === 'Group'){
            typeText = 'Permission Set Group'
        }
        ws_FieldPermission.cell(rowNum, 1 ).string( parentName ) ;
        ws_FieldPermission.cell(rowNum, 2 ).string( typeText ) ;
        ws_FieldPermission.cell(rowNum, 3 ).string( perm.SobjectType ) ;
        ws_FieldPermission.cell(rowNum, 4 ).string( perm.Field ) ;
        ws_FieldPermission.cell(rowNum, 5 ).string( perm.PermissionsEdit ? "✔️" : "" ) ;
        ws_FieldPermission.cell(rowNum, 6 ).string( perm.PermissionsRead ? "✔️" : "" ) ;
        ws_FieldPermission.cell(rowNum, 7 ).string( perm.SobjectType ) ;
        rowNum++;
    });

}

function addHeader(ws, headers, rowNumber, headerStyle){
    let coulmnNumber = 1 ;
    headers.forEach(element =>{
        ws.cell(rowNumber,coulmnNumber).string(element).style(headerStyle);
        coulmnNumber++;
    });
}