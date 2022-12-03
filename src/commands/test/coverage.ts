/* eslint-disable */
//import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';

import { TestCoverageResponse, CodeCoveragetable} from '../../scripts/coverage';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core, or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Org extends SfdxCommand {
    public static description = messages.getMessage('commandDescription');

    public static examples = [`
        sfdx data:coverage -u utils -c

        sfdx data:coverage -u utils -c --json

        sfdx data:coverage -u utils -a --json

        sfdx data:coverage -u utils -a
    `]

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        name: flags.string({
            char: 'n',
            description: messages.getMessage('nameFlagDescription'),
        }),
        force: flags.boolean({
            char: 'f',
            description: messages.getMessage('forceFlagDescription'),
        }),
        aggregate: flags.boolean({
            char: 'a',
            description: messages.getMessage('aggregateFlagDescription'),
        }),
        coverage: flags.boolean({
            char: 'c',
            description: messages.getMessage('coverageFlagDescription'),
        }),
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
        let query = 'SELECT NumLinesCovered, NumLinesUncovered, Coverage, ApexClassorTrigger.Name FROM ApexCodeCoverageAggregate';
        if(this.flags.coverage){
            query = 'SELECT ApexTestClassId, NumLinesCovered, NumLinesUncovered, Coverage, ApexClassorTrigger.Name FROM ApexCodeCoverage';
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
                ApexClassOrTrigger : element.ApexClassOrTrigger.Name,
                NumLinesCovered : element.NumLinesCovered,
                NumLinesUncovered : element.NumLinesUncovered
            };
            const covered = element.Coverage.coveredLines;
            const uncovered = element.Coverage.uncoveredLines;
            let percent = 0;
            if(covered && uncovered){
                percent = covered.length / (covered.length + uncovered.length);
                record.Percentage = percent? ( ( Math.abs( percent ) ) * 100 ).toFixed(0) +'%' : 0+'%';
            }
            codeCoverage.push(record);
        });

        const tableColumnData = ['ApexClassOrTrigger', 'NumLinesCovered', 'NumLinesUncovered', 'Percentage'];

        this.ux.table( codeCoverage, tableColumnData );

        // Return an object to be displayed with --json
        return codeCoverage;
    }
}
