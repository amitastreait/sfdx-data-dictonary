/* eslint-disable */
//import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
var fs = require('fs');
import { TestCoverageResponse, CodeCoveragetable} from '../../models/coverage';

/* import the object of exportFile so that Excel Sheet can be created */
import excelUtil = require('../../scripts/exportCoverage');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core, or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Coverage extends SfdxCommand {

    public static description = messages.getMessage('commandCoverageDescription');

    public static examples = [`
    sfdx code:coverage -u username@salesforce.com --aggregate
    sfdx code:coverage -u username@salesforce.com --aggregate --json
    sfdx code:coverage -u username@salesforce.com --aggregate --format xlsx --name AccountTriggerTest --file ./coverage/CoverageReport.xlsx
    sfdx code:coverage -u username@salesforce.com --aggregate --format xlsx --file ./coverage/CoverageReport.xlsx
    sfdx code:coverage -u username@salesforce.com --aggregate --format html --file ./coverage/CoverageReport.html
    sfdx code:coverage -u username@salesforce.com --aggregate --format table
    sfdx code:coverage -u username@salesforce.com --aggregate --format table --name AccountTriggerTest
    `]

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        name: flags.string({
            char: 'n',
            description: messages.getMessage('classFlagDescription'),
        }),
        aggregate: flags.boolean({
            char: 'a',
            description: messages.getMessage('aggregateFlagDescription'),
        }),
        coverage: flags.boolean({
            char: 'c',
            description: messages.getMessage('coverageFlagDescription'),
        }),
        file: flags.string({
            char: 'p',
            description: messages.getMessage('coveragePathFlagDescription'),
        }),
        format: flags.string({
            char: 'f',
            description: messages.getMessage('coverageFormatFlagDescription'),
            default: "table",
            required: false
        }),
        wait: flags.minutes({ description: 'number of minutes to wait for creation' }),
        notify: flags.url({ description: 'url to notify upon completion' })
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise< Array<CodeCoveragetable> > {

        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

		const name = this.flags.name;
        const fileName = this.flags.file || 'CodeCoverageReport.xlsx';
        const reportFormat = this.flags.format || 'table';
        let query = 'SELECT NumLinesCovered, NumLinesUncovered, Coverage, ApexClassorTrigger.Name FROM ApexCodeCoverageAggregate';
        if(this.flags.coverage){
            query = 'SELECT ApexTestClassId, TestMethodName,NumLinesCovered, NumLinesUncovered, Coverage, ApexClassorTrigger.Name FROM ApexCodeCoverage';
        }

		if(name){
			query += ` WHERE ApexClassOrTrigger.Name '${name}'`;
		}

        const codeCoverage:Array<CodeCoveragetable>= [] ;

        const resultCoverage = await conn.request(`/services/data/v56.0/tooling/query?q=${query}`);
        let testClassCoverage:TestCoverageResponse = resultCoverage as TestCoverageResponse;
        //
        testClassCoverage.records.forEach(element => {
            let record: CodeCoveragetable = {
                ApexClassOrTrigger : element.ApexClassOrTrigger ? element.ApexClassOrTrigger.Name : "",
                NumLinesCovered : element.NumLinesCovered,
                NumLinesUncovered : element.NumLinesUncovered,
                TestMethodName : element.TestMethodName ? element.TestMethodName : ""
            };
            const covered = element.Coverage.coveredLines;
            const uncovered = element.Coverage.uncoveredLines;
            let percent:number = 0;
            let initialNumber:number = 0;
            if(covered && uncovered){
                percent = covered.length / (covered.length + uncovered.length);
                record.Percentage = percent? ( ( Math.abs( percent ) ) * 100 ).toFixed(0) +'%' : 0+'%';
                record.PercentageNumber = percent ? parseInt( ( Math.abs( percent ) * 100 ).toFixed(0) ) : initialNumber;
            }
            codeCoverage.push(record);
        });

        const tableColumnData = ['ApexClassOrTrigger', 'NumLinesCovered', 'NumLinesUncovered', 'Percentage', 'TestMethodName'];
        //this.ux.log(`report format ${reportFormat}`);
        if(reportFormat === 'table'){
            /* Print the HTML table */
            this.ux.table( codeCoverage, tableColumnData );
        }else if(reportFormat === 'html'){
            /* Prepare the HTML Report for Code Coverage */
            let headingTitle = `This report was generated using sfdx perm:list -u ${conn.getUsername()} --name ${fileName} --format html command`;
            let codeCoverageReport = excelUtil.generateCodeCoverageReport(codeCoverage, headingTitle);
            fs.writeFile( fileName , codeCoverageReport, function (err) {
                if (err) throw err;
                //console.log('File is created successfully.');
            });
        }else if(reportFormat === 'xlsx'){
            /* Prepare the XLSX file with the Code Coverage */
            excelUtil.createFile(fileName, codeCoverage, this);
            this.ux.log(`Code Coverage written at ${fileName}`);
        }
        // Return an object to be displayed with --json
        return codeCoverage;
    }
}
