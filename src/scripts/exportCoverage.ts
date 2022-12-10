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
        ws_TestCoverage.cell(rowNum, 1 ).string( coverage.ApexClassOrTrigger ? coverage.ApexClassOrTrigger : "" ) ;
        ws_TestCoverage.cell(rowNum, 2 ).number( coverage.NumLinesCovered ? coverage.NumLinesCovered : 0 ) ;
        ws_TestCoverage.cell(rowNum, 3 ).number( coverage.NumLinesUncovered ? coverage.NumLinesUncovered : 0 ) ;
        ws_TestCoverage.cell(rowNum, 4 ).string( coverage.TestMethodName ? coverage.TestMethodName : "" ) ;
        ws_TestCoverage.cell(rowNum, 5 ).string( coverage.Percentage ? coverage.Percentage : "0%" ) ;
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

export function generateCodeCoverageReport(codeCoverage : Array<CodeCoveragetable>){
    let tableContent = '';
    codeCoverage.forEach( coveage => {
        tableContent += `<tr>
            <td> ${coveage.ApexClassOrTrigger} </td>
            <td> ${coveage.NumLinesCovered} </td>
            <td> ${coveage.NumLinesUncovered}  </td>
            <td> ${coveage.TestMethodName}  </td>
            <td> ${coveage.Percentage}  </td>
            <td> <div class="bar" style="--percent: ${coveage.PercentageNumber};"></div> </td>
        </tr>`
    });
    return (`
        <html lang="en">
            <head>
                <title>Test Coverage Report</title>
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
                    .bar {
                        height: 20px;
                        background-color: #f5f5f5;
                    }
                    .bar::before {
                        content: '';
                        display: flex;
                        justify-content: end;
                        width: calc(var(--percent) * 1%);
                        height: 100%;
                        background: #2486ff;
                        white-space: nowrap;
                    }
                </style>
            </head>
            <body>
                <h1></h1>
                <table class="center">
                    <thead>
                        <tr>
                            <th>Apex Class Or Trigger</th>
                            <th style="width: 180px;">NumLines Covered</th>
                            <th style="width: 180px;">NumLines Uncovered</th>
                            <th style="width: 180px;">TestMethodName</th>
                            <th style="width: 180px;">Coverage %</th>
                            <th style="width: 180px;"></th>
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