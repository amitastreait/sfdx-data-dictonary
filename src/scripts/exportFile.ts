/* eslint-disable*/

var xl = require('excel4node');
import { objectDesc } from './utils';

/**
 *  @description : The method to create the excel file at the given path location
  * @param fileName : Fully Qualified path for the file name. Ex - downloads/ExportedObjects.xslx
  * @param combinedMetadata : Contains the information all about object & their fields
  * @param context : contains the information about the user passed using -u parameter
*/

var headerStyle = null;
export async function createFile(fileName, combinedMetadata : Array<objectDesc>, context, classificationMap ) {

    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Create a reusable style
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

    var infoValueStyle = wb.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '#f0f8ff'
        }
    });

    var wrap = wb.createStyle({
        alignment: {
            wrapText: true
        },
    });

    /**
     * Create first worksheet with information about tool & summary of objects
     */
    InformationWorkSheet(wb, combinedMetadata, context);

    /**
     * Create second worksheet for simple picklist
    */
    simplePicklistWorkSheet(wb,combinedMetadata,context);

    /**
     * Creates the third worksheet for validation rule
    */
    ValiationRuleTab(wb, combinedMetadata);

    /**
     * Creates the fourth worksheet for Flow
    */
    FlowTab( wb, combinedMetadata );

    /**
     * Creates the fifth worksheet for Apex Trigger
    */
    ApexTriggerTab( wb, combinedMetadata, context);

    /**
     * Create separate tab for each object with all field information
     */
    objectTabs(wb,combinedMetadata, classificationMap);

    wb.write(fileName);

    /**
     *  ####################### Methods started ###################
     */

    function ValiationRuleTab(wb, combinedMetadata: Array<objectDesc>){
        var ws_ValidationRule = wb.addWorksheet("ValidationRules");
        let headers: String[] = ['Object Name', 'Name', 'Description','ErrorDisplayField','Error Message', 'Active' ];
        //context.ux.startSpinner('adding validation rules  ');
        addHeader(ws_ValidationRule, headers, 1, headerStyle);

        var rowNum = 2;
        /* var row_Offset_InfoSheet = 0;
        var col_Offset_InfoSheet = 0; */

        combinedMetadata.forEach(element => {
            let objName = element.name;
            let initialRowNum_obj = rowNum;
            let totalRows_obj = -1;

            element.validations.forEach(validationRule => {
                /* let initialRowNum_field :number = rowNum;
                let totalRows_field : number = -1; */
                //context.ux.log(` validationRule.ValidationName ${ validationRule.ValidationName }` );
                let excelColumns: String[] = [objName, validationRule.ValidationName, validationRule.Description, validationRule.ErrorDisplayField,
                    validationRule.ErrorMessage, validationRule.Active ? "Yes":"No"];
                addRowsToExcel(ws_ValidationRule , rowNum, excelColumns);
                rowNum++;
                totalRows_obj++;
                //totalRows_field++;
            });
             //Merge Object Columns
            let finalObjectColumn =  initialRowNum_obj + totalRows_obj ;
            if(finalObjectColumn > initialRowNum_obj){
                ws_ValidationRule.cell(initialRowNum_obj,1, finalObjectColumn ,1,true).string(element.name).style({ alignment: { vertical: 'top' } });
            }
        });

    }

    function FlowTab(wb, combinedMetadata: Array<objectDesc>){
        var ws_Flow = wb.addWorksheet("Record Triggered Flows");
        let headers: String[] = ['Object Name', 'API Name', 'Label', 'Description',
            'ProcessType','TriggerType', 'LastModifiedBy', 'Active'
        ];
        //context.ux.startSpinner('adding validation rules  ');
        addHeader(ws_Flow, headers, 1, headerStyle);

        var rowNum = 2;

        combinedMetadata.forEach(element => {
            let objName = element.name;
            let initialRowNum_obj = rowNum;
            let totalRows_obj = -1;

            element.flows.forEach( flow => {
                let excelColumns : String[] = [objName, flow.ApiName , flow.Label, flow.Description, flow.ProcessType, flow.TriggerType,
                    flow.LastModifiedBy, flow.IsActive ? "Yes":"No"];
                addRowsToExcel(ws_Flow , rowNum, excelColumns);
                rowNum++;
                totalRows_obj++;
                //totalRows_field++;
            });
             //Merge Object Columns
            let finalObjectColumn =  initialRowNum_obj + totalRows_obj ;
            if(finalObjectColumn > initialRowNum_obj){
                ws_Flow.cell(initialRowNum_obj,1, finalObjectColumn ,1,true).string(element.name).style({ alignment: { vertical: 'top' } });
            }
        });
    }

    function ApexTriggerTab(wb, combinedMetadata: Array<objectDesc>, context){
        var ws_Flow = wb.addWorksheet("Apex Triggers");
        let headers: String[] = ['Object Name', 'Name', 'Status', 'Api Version',
            'Created Date','Last Modified Date', 'Namespace Prefix', 'Valid'
        ];
        //context.ux.startSpinner('adding validation rules  ');
        addHeader(ws_Flow, headers, 1, headerStyle);

        var rowNum = 2;

        combinedMetadata.forEach(element => {
            let objName = element.name;
            let initialRowNum_obj = rowNum;
            let totalRows_obj = -1;

            element.triggers.forEach( trigger => {
                /* let excelColumns = [objName, trigger.Name , trigger.Status, trigger.ApiVersion, trigger.CreatedDate, trigger.LastModifiedDate,
                    trigger.NamespacePrefix, trigger.IsValid ? "Yes":"No"];
                addRowsToExcel(ws_Flow , rowNum, excelColumns); */
                //context.ux.log(`Trigger => ${JSON.stringify(trigger || {} )}`);
                ws_Flow.cell(rowNum, 1 ).string( objName ? objName : "" ) ;
                ws_Flow.cell(rowNum, 2 ).string( trigger.Name ? trigger.Name : "" ) ;
                ws_Flow.cell(rowNum, 3 ).string( trigger.Status ?  trigger.Status : "" ) ;
                ws_Flow.cell(rowNum, 4 ).number( trigger.ApiVersion ? trigger.ApiVersion : "" ) ;
                ws_Flow.cell(rowNum, 5 ).date( trigger.CreatedDate ? trigger.CreatedDate : "" ) ;
                ws_Flow.cell(rowNum, 6 ).date( trigger.LastModifiedDate ? trigger.LastModifiedDate : "" ) ;
                ws_Flow.cell(rowNum, 7 ).string( trigger.NamespacePrefix ? trigger.NamespacePrefix : "" ) ;
                ws_Flow.cell(rowNum, 8 ).string( trigger.IsValid ? "Yes":"No" );

                rowNum++;
                totalRows_obj++;
            });
             //Merge Object Columns
            let finalObjectColumn =  initialRowNum_obj + totalRows_obj ;
            if(finalObjectColumn > initialRowNum_obj){
                ws_Flow.cell(initialRowNum_obj,1, finalObjectColumn ,1,true).string(element.name).style({ alignment: { vertical: 'top' } });
            }
        });
    }

    /**
     * Create separate tab for each object with all field information
     * @param wb
     * @param combinedMetadata
     */
    function objectTabs(wb,combinedMetadata: Array<objectDesc>, classificationMap){
        combinedMetadata.forEach(element => {
            var ws =  wb.addWorksheet(element.name);
            let headers: String[] = ['Label','Name' ,'Help Text'  ,'Is Standard'  ,'Formula' ,'Max Length',
                                        'Type' ,'Is unique' ,'precision' ,'Scale' ,'Encrypted' ,'ExternalId' ,'PicklistValues' ,
                                        'Is Creatable' ,'Is Updatable' ,'Is Required', 'Restricted Picklist',
                                        'Description', 'Data Sensitivity Level', 'Field Usage', 'Data Owner', 'Compliance Categorization'
                                    ];
            addHeader(ws,headers,1,headerStyle);
            for(var i = 0; i< element.fields.length; i++){
                var rowNumber = i+2 ;
                var isRestPickList = 'NA';
                let dataClassification = classificationMap [ element.fields[i].name ];

                addString(ws, rowNumber, 1, element.fields[i].label, "label" , element.fields[i]) ;
                addString(ws, rowNumber, 2, element.fields[i].name , "name" , element.fields[i]) ;
                addString(ws, rowNumber, 3, element.fields[i].inlineHelpText || "", "inline help text" , element.fields[i]) ;
                addString(ws, rowNumber, 4, element.fields[i].custom ? "No" : "Yes" , "is custom" , element.fields[i]) ;
                addString(ws, rowNumber, 5, element.fields[i].calculatedFormula || "" , "calculated formula" , element.fields[i]) ;
                addNumber(ws, rowNumber, 6, element.fields[i].length, "length" , element.fields[i]) ;
                addString(ws, rowNumber, 7, element.fields[i].type || "", "type" , element.fields[i]) ;
                addString(ws, rowNumber, 8, element.fields[i].unique ? "Yes" : "No" , "unique" , element.fields[i]) ;
                addNumber(ws, rowNumber, 9, element.fields[i].precision, "precision", element.fields[i]) ;
                addNumber(ws, rowNumber, 10, element.fields[i].scale, "scale" , element.fields[i]) ;
                addString(ws, rowNumber, 11, element.fields[i].encrypted ? "Yes" : "No" , "encrypted" , element.fields[i]) ;
                addString(ws, rowNumber, 12, element.fields[i].externalId ? "Yes" : "No" , "external Id" , element.fields[i]) ;
                let pVal = parsePicklist(element.fields[i].picklistValues);
                ws.cell(i+2,13).string(pVal).style(wrap);
                //ws.cell(i+2,13).formula('="'+pVal+'"');
                addString(ws, rowNumber, 14, element.fields[i].createable ? "Yes" : "No" , "creatable" , element.fields[i]) ;
                addString(ws, rowNumber, 15, element.fields[i].updateable ? "Yes" : "No" , "updateable" , element.fields[i]) ;
                addString(ws, rowNumber, 16, element.fields[i].nillable ? "No" : "Yes" , "nillable" , element.fields[i]) ;
                if(element.fields[i].type == 'picklist'){
                    if(element.fields[i].restrictedPicklist){
                        isRestPickList = 'Yes';
                    }else{
                        isRestPickList = 'No';
                    }
                }
                addString(ws, rowNumber, 17,isRestPickList, "Restricted Picklist" , element.fields[i]) ;
                if(dataClassification){
                    /* Add data classification fields in the excel sheet */
                    ws.cell(rowNumber, 18 ).string( dataClassification.Description ? dataClassification.Description as string : "" ) ;
                    ws.cell(rowNumber, 19 ).string( dataClassification.SecurityClassification ? dataClassification.SecurityClassification as string : "" ) ;
                    ws.cell(rowNumber, 20 ).string( dataClassification.BusinessStatus ? dataClassification.BusinessStatus as string : "" ) ;
                    ws.cell(rowNumber, 21 ).string( dataClassification.BusinessOwnerId ? dataClassification.BusinessOwner.Name as string : "" ) ;
                    ws.cell(rowNumber, 22 ).string( dataClassification.ComplianceGroup as string ? dataClassification.ComplianceGroup : "" ) ;
                    /*
                        addString(ws, rowNumber, 18, dataClassification.Description , "Description" , element.fields[i]) ;
                        addString(ws, rowNumber, 19, dataClassification.SecurityClassification , "Data Sensitivity Level" , element.fields[i]) ;
                        addString(ws, rowNumber, 20, dataClassification.BusinessStatus , "Field Usage" , element.fields[i]) ;
                        addString(ws, rowNumber, 21, dataClassification.BusinessOwnerId ? dataClassification.BusinessOwner.Name as string : "" , "Data Owner" , element.fields[i]) ;
                        addString(ws, rowNumber, 22, dataClassification.ComplianceGroup , "Compliance Categorization" , element.fields[i]) ;
                    */
                }
            }
        });
    }

    /**
     * Create a dedicated workbook for multi Picklists
     * @param wb Instance of workbook
     * @param combinedMetadata Full Metadata
     * @param context Salesforce CLI object context
     */
    function simplePicklistWorkSheet(wb, combinedMetadata : Array<objectDesc>, context){

        var ws_Picklist = wb.addWorksheet("Picklist");
        let headers: String[] = ['Object Name', 'Field Name','Value','Is Active' ];
        addHeader(ws_Picklist,headers,1,headerStyle);
        //header was row number 1
        var rowNum = 2;

        combinedMetadata.forEach(element => {
            let objName = element.name;
            let initialRowNum_obj = rowNum;
            let totalRows_obj = -1;

            element.fields.forEach(field =>{
                let initialRowNum_field :number = rowNum;
                let totalRows_field : number = -1;

                if(field.type == 'picklist'){
                    //let pVal = field.picklistValues;
                    field.picklistValues.forEach(option =>{
                        if(!field.controllerName){
                            let excelColumns: String[] = [objName, field.name, option.value, option.active ? "Yes":"No"];
                            addPickListToExcel(ws_Picklist,rowNum,excelColumns);
                            rowNum++;
                            totalRows_obj++;
                            totalRows_field++;
                        }
                    });
                    //Merge Field API Name Column
                    let finalNum : number = initialRowNum_field + totalRows_field ;
                    if( finalNum > initialRowNum_field){
                        //context.ux.log(initialRowNum_field+' , 2 , '+finalNum+' , 2 , true');
                        ws_Picklist.cell(initialRowNum_field ,2, finalNum ,2,true).string(field.name).style({ alignment: { vertical: 'top' } });
                    }
                }
            });
             //Merge Object Columns
            let finalObjectColumn =  initialRowNum_obj + totalRows_obj ;
            if(finalObjectColumn > initialRowNum_obj){
                ws_Picklist.cell(initialRowNum_obj,1, finalObjectColumn ,1,true).string(element.name).style({ alignment: { vertical: 'top' } });
            }
        });
    }

    /**
     * Utility method to add whole row at a time for picklist in Excel sheet
     * @param ws_Picklist Worksheet instance
     * @param rowNum Row number to be used for adding
     * @param excelColumns List of all columns to be added
    */
    function addPickListToExcel(ws,rowNum,excelColumns){
        var colNum = 1;
        excelColumns.forEach(column=>{
            ws.cell(rowNum,colNum).string(column) ;
            colNum++;
        });
    }

    function addRowsToExcel(ws, rowNum, excelColumns){
        var colNum = 1;
        excelColumns.forEach(column=>{
            ws.cell(rowNum,colNum).string(column ? column : "") ;
            colNum++;
        });
    }


    /**
     *
     * @param ws Utility method to create header & default style
     * @param headers
     * @param rowNumber
     * @param headerStyle
     */

    function addHeader(ws, headers, rowNumber, headerStyle){
        let coulmnNumber = 1 ;
        headers.forEach(element =>{
            ws.cell(rowNumber,coulmnNumber).string(element).style(headerStyle);
            coulmnNumber++;
        });

    }

    /**
     * This method makes debugging easy if needed while adding string in Workbook
     * @param ws
     * @param row
     * @param col
     * @param val
     * @param propName
     * @param field
     */
    function addString(ws, row,col,val,propName,field){
        try{
            ws.cell(row,col).string(val);
        }catch(e){
            context.ux.log('Exception : Property Name - '+propName+' , Field Name - '+field.name+' , Error - '+e.message);
        }
    }

    /**
     * This method makes debugging easy if needed while adding numbers in Workbook
     * @param ws
     * @param row
     * @param col
     * @param val
     * @param objName
     * @param field
     */
    function addNumber(ws, row,col,val,objName,field){
        try{
            ws.cell(row,col).number(val);
        }catch(e){
            context.ux.log('Object Name - '+objName+' , Field Name - '+field.name+' , Error - '+e.message);
        }
    }

    /**
     * Create first default worksheet with information about tool, version & author
     * @param wb Workbook
     * @param combinedMetadata Full Metadata Information
     * @param context Salesforce Context
     */
    function InformationWorkSheet(wb, combinedMetadata : Array<objectDesc>, context) {

        var sheetoption = {
            'sheetFormat': {
                'defaultColWidth': 30
            }
        };
        var row_Offset_InfoSheet = 0;
        var col_Offset_InfoSheet = 0;
        var ws_info = wb.addWorksheet("Info", sheetoption);
        let rowNumber = 1;

        toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 1 + col_Offset_InfoSheet, "Tool Name");
        toolversion(ws_info, infoValueStyle, rowNumber + row_Offset_InfoSheet, 2 + col_Offset_InfoSheet, "Data Dictonary");
        rowNumber++;

        toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 1 + col_Offset_InfoSheet, "Tool Created By");
        toolversion(ws_info, infoValueStyle, rowNumber + row_Offset_InfoSheet, 2 + col_Offset_InfoSheet, "Amit Singh");
        rowNumber++;

        toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 1 + col_Offset_InfoSheet, "Connected User name");
        toolversion(ws_info, infoValueStyle, rowNumber + row_Offset_InfoSheet, 2 + col_Offset_InfoSheet, context.org.getUsername() );
        rowNumber++;

        /*toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 1 + col_Offset_InfoSheet, "Connection URL");
        toolversion(ws_info, infoValueStyle, rowNumber + row_Offset_InfoSheet, 2 + col_Offset_InfoSheet, context.org.getConnection().baseUrl() );
        rowNumber++;*/

        toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 1 + col_Offset_InfoSheet, "Version");
        toolversion(ws_info, infoValueStyle, rowNumber + row_Offset_InfoSheet, 2 + col_Offset_InfoSheet, "0.0.1");
        rowNumber++;

        toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 1 + col_Offset_InfoSheet, "Generated Date");
        toolversion(ws_info, infoValueStyle, rowNumber + row_Offset_InfoSheet, 2 + col_Offset_InfoSheet, new Date(Date.now()).toLocaleString());

        rowNumber = 1;
        toolversion(ws_info, headerStyle, rowNumber + row_Offset_InfoSheet, 3 + col_Offset_InfoSheet, "Included Objects");

        combinedMetadata.forEach(element => {
            //context.ux.log(element.name);
            let linkFormula =  element.name;
            ws_info.cell( rowNumber + row_Offset_InfoSheet, 4 + col_Offset_InfoSheet).string(linkFormula);
            rowNumber++;
        });
    }

    /**
     * Utility method to print tool version information
     * @param ws_info
     * @param headerStyle
     * @param rowNum
     * @param colNum
     * @param txt
     */
    function toolversion(ws_info, headerStyle, rowNum, colNum, txt){
        if(headerStyle){
            ws_info.cell(rowNum,colNum).string(txt).style(headerStyle)  ;
        }else{
            ws_info.cell(rowNum,colNum).string(txt) ;
        }
    }

    /**
     * This method handles classic or new Picklist metadata and sends as csv string
     * @param arr
     * @returns
     */
    function parsePicklist(arr){
        //context.ux.log(arr);
        let retVal = '';
        for(var i = 0;i < arr.length; i++){
            let tmpVal = arr[i].label ? arr[i].label : arr[i].value ;
            if(retVal){
                retVal = retVal+',\n'+ tmpVal ;
            }else{
                retVal = tmpVal ;
            }
        }
        return retVal ;
    }

}