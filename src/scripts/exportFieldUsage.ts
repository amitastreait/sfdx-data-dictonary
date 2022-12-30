var xl = require('excel4node');

var headerStyle = null;

export async function createFile(fileName, totalRecords, context, totalCount) {
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

    fieldUsageTab(wb, totalRecords, context, totalCount);
    wb.write(fileName);

}

function fieldUsageTab(wb, totalRecords, context, totalCount ){
    var ws_fieldUsage = wb.addWorksheet("Field Usage");
    let headers: String[] = ['Field', 'Used in Total Records', 'Percentage Usage'];
    addHeader(ws_fieldUsage, headers, 1, headerStyle);
    context.ux.log(`Writing the field usage into excel sheets `);
    var rowNum = 2;
    for (let key in totalRecords ) {
        if(typeof totalRecords[key] !== 'object'){
            //context.ux.log( key );
            let val:number = totalRecords[key];
            let percent = (val/totalCount).toFixed(4);
            let finalPercentage = parseFloat(percent)*100;
            //context.ux.log( val );
            //context.ux.log( percent );
            //console.log( parseInt(percent)*100  );
            ws_fieldUsage.cell(rowNum, 1 ).string( key ) ;
            ws_fieldUsage.cell(rowNum, 2 ).number( val ) ;
            ws_fieldUsage.cell(rowNum, 3 ).string( `${finalPercentage.toFixed(2)}%` ) ;
            rowNum++;
        }
    }
    /*
    objPermissions.records.forEach( perm => {
        ws_ObjectPermissions.cell(rowNum, 1 ).string( perm.Parent.Name ) ;
        ws_ObjectPermissions.cell(rowNum, 2 ).string( perm.Parent.Type ) ;
        ws_ObjectPermissions.cell(rowNum, 3 ).string( perm.PermissionsCreate ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 4 ).string( perm.PermissionsRead ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 5 ).string( perm.PermissionsEdit ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 6 ).string( perm.PermissionsDelete ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 7 ).string( perm.PermissionsViewAllRecords ? "✔️" : "" ) ;
        ws_ObjectPermissions.cell(rowNum, 8 ).string( perm.PermissionsModifyAllRecords ? "✔️" : "" ) ;
        rowNum++;
    });
    */
}
function addHeader(ws, headers, rowNumber, headerStyle){
    let coulmnNumber = 1 ;
    headers.forEach(element =>{
        ws.cell(rowNumber,coulmnNumber).string(element).style(headerStyle);
        coulmnNumber++;
    });
}