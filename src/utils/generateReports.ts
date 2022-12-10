var fs = require('fs');
import { ObjectPermissions } from '../scripts/objectPermissions';
import { FieldPermissions } from '../scripts/fieldPermissions';

export async function generateHTMLReport(objectName:string, fileName, objPermissions : ObjectPermissions , fldPermissions : FieldPermissions, context) {
    let htmlReport = generateHTMLRepord(objPermissions);
    context.ux.log(`Generating the html report....`);
    fs.writeFile( fileName , htmlReport, function (err) {
        if (err) throw err;
        //console.log('File is created successfully.');
    });

    let fieldPermissionReport = generateFieldPermissionReport(fldPermissions);
    fs.writeFile( `${objectName}-FieldPermissions.html` , fieldPermissionReport, function (err) {
        if (err) throw err;
        //console.log('File is created successfully.');
    });
}

function generateFieldPermissionReport(fldPermissions : FieldPermissions){
    let tableContent = '';
    fldPermissions.records.forEach( perm => {
        tableContent += `<tr>
            <td> ${perm.Parent.Name} </td>
            <td> ${perm.Parent.Type} </td>
            <td> ${perm.PermissionsRead ? "✔️" : ""}  </td>
            <td> ${perm.PermissionsEdit ? "✔️" : ""}  </td>
        </tr>`
    });
    return (`
        <html lang="en">
            <head>
                <title>Permissions Report</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="icon" type="image/x-icon" href="https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png">
                <style>
                    table, th, td {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }
                    table.center {
                        margin-left: auto;
                        margin-right: auto;
                    }
                </style>
            </head>
            <body>
                <h1> Generated using sfdx perm:list -u utils -o "objectname" command</h1>
                <table class="center">
                    <thead>
                        <tr>
                            <th>Parent Name</th>
                            <th style="width: 180px;">Parent Type</th>
                            <th style="width: 180px;">PermissionsRead</th>
                            <th style="width: 180px;">PermissionsEdit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableContent}
                    </tbody>
                </table>
            </body>
        </html>
    `);
}

function generateHTMLRepord(objPermissions : ObjectPermissions) {
    let tableContent = '';
    objPermissions.records.forEach( perm => {
        tableContent += `<tr>
            <td> ${perm.Parent.Name} </td>
            <td> ${perm.Parent.Type} </td>
            <td> ${perm.PermissionsCreate ? "✔️" : ""}  </td>
            <td> ${perm.PermissionsRead ? "✔️" : ""}  </td>
            <td> ${perm.PermissionsEdit ? "✔️" : ""}  </td>
            <td> ${perm.PermissionsDelete ? "✔️" : ""}  </td>
            <td> ${perm.PermissionsViewAllRecords ? "✔️" : ""}  </td>
            <td> ${perm.PermissionsModifyAllRecords ? "✔️" : ""}  </td>
        </tr>`
    });
    return (`
        <html lang="en">
            <head>
                <title>Permissions Report</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="icon" type="image/x-icon" href="https://www.pantherschools.com/wp-content/uploads/2022/02/cropped-logoblack.png">
                <style>
                    table, th, td {
                        border: 1px solid black;
                        border-collapse: collapse;
                    }

                    table.center {
                        margin-left: auto;
                        margin-right: auto;
                    }
                </style>
            </head>
            <body>
                <h1> Generated using sfdx perm:list -u utils -o "objectname" command</h1>
                <table class="center">
                    <thead>
                        <tr>
                            <th>Parent Name</th>
                            <th style="width: 180px;">Parent Type</th>
                            <th style="width: 180px;">PermissionsCreate</th>
                            <th style="width: 180px;">PermissionsRead</th>
                            <th style="width: 180px;">PermissionsEdit</th>
                            <th style="width: 180px;">PermissionsDelete</th>
                            <th style="width: 180px;">PermissionsViewAllRecords</th>
                            <th style="width: 180px;">PermissionsModifyAllRecords</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableContent}
                    </tbody>
                </table>
            </body>
        </html>
    `);
}