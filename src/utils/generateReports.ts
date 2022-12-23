var fs = require('fs');
import { ObjectPermissions } from '../scripts/objectPermissions';
import { FieldPermissions } from '../scripts/fieldPermissions';

export async function generateHTMLReport(objectName:string, fileName, objPermissions : ObjectPermissions , fldPermissions : FieldPermissions, context, headingTitle, fieldPermissionsName) {
    let htmlReport = generateHTMLRepord(objPermissions, headingTitle);
    context.ux.log(`Generating the html report....`);
    fs.writeFile( fileName , htmlReport, function (err) {
        if (err) throw err;
        //console.log('File is created successfully.');
    });

    let fieldPermissionReport = generateFieldPermissionReport(fldPermissions, headingTitle);
    fs.writeFile( `${fieldPermissionsName}` , fieldPermissionReport, function (err) {
        if (err) throw err;
        //console.log('File is created successfully.');
    });
}

function generateFieldPermissionReport(fldPermissions : FieldPermissions, headingTitle){
    let tableContent = '';
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
        tableContent += `<tr>
            <td> ${perm.Field} </td>
            <td> ${parentName} </td>
            <td> ${typeText} </td>
            <td> ${perm.SobjectType} </td>
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
                <h1 style="text-align:center; margin:2px;"> ${headingTitle} </h1>
                <table class="center">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Profile/Permission Set Name</th>
                            <th style="width: 180px;">Parent Type</th>
                            <th style="width: 180px;">sOject Name</th>
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

function generateHTMLRepord(objPermissions : ObjectPermissions, headingTitle) {
    let tableContent = '';
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
        tableContent += `<tr>
            <td> ${parentName} </td>
            <td> ${typeText} </td>
            <td> ${perm.SobjectType} </td>
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
            <h1 style="text-align:center; margin:2px;"> ${headingTitle} </h1>
                <table class="center">
                    <thead>
                        <tr>
                            <th>Profile/Permission Set Name</th>
                            <th style="width: 180px;">Parent Type</th>
                            <th style="width: 180px;">sOject Name</th>
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