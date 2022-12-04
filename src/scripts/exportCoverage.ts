var xl = require('excel4node');
import { CodeCoveragetable} from './coverage';
var headerStyle = null;
export async function createFile(fileName, codeCoverage:Array<CodeCoveragetable>, context) {
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

    /**
     * Call the method to prepare the Code Coverage Tab
     */
    TestCoverageTab(wb, codeCoverage);

    wb.write(fileName);

}

function TestCoverageTab(wb, codeCoverage : Array<CodeCoveragetable>){
    var ws_TestCoverage = wb.addWorksheet("Apex Test Coverage");
    let headers: String[] = ['Apex Class Or Trigger', 'NumLines Covered', 'NumLines Uncovered', 'TestMethodName', 'Coverage %' ];
    //context.ux.startSpinner('adding validation rules  ');
    addHeader(ws_TestCoverage, headers, 1, headerStyle);

    var rowNum = 2;
    /* var row_Offset_InfoSheet = 0;
    var col_Offset_InfoSheet = 0; */

    codeCoverage.forEach( coverage => {
        ws_TestCoverage.cell(rowNum, 1 ).string( coverage.ApexClassOrTrigger ) ;
        ws_TestCoverage.cell(rowNum, 2 ).number( coverage.NumLinesCovered ) ;
        ws_TestCoverage.cell(rowNum, 3 ).number( coverage.NumLinesUncovered ) ;
        ws_TestCoverage.cell(rowNum, 3 ).string( coverage.TestMethodName ) ;
        ws_TestCoverage.cell(rowNum, 4 ).number( coverage.Percentage ) ;
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