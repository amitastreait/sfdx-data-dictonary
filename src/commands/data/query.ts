/* eslint-disable */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Query extends SfdxCommand {

        public static description = messages.getMessage('commandDescription');

        public static examples = messages.getMessage('examples').split(os.EOL);

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
            query: flags.string({
                char: 'q',
                description: messages.getMessage('accountNameDescritpion'),
                required: true
            }),
        };

        // Comment this out if your command does not require an org username
        protected static requiresUsername = true;

        // Comment this out if your command does not support a hub org username
        protected static supportsDevhubUsername = true;

        // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
        protected static requiresProject = false;

        public async run(): Promise<AnyJson> {
        const query = (this.flags.query || 'Select Id, Name, TrialExpirationDate from Organization') as string;

        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

        // Query the org - const result = await conn.query<Account>(query);
        const result = await conn.query(query);

        // Organization will always return one result, but this is an example of throwing an error
        // The output and --json will automatically be handled for you.
        if (!result.records || result.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }

        // this.hubOrg is NOT guaranteed because supportsHubOrgUsername=true, as opposed to requiresHubOrgUsername.
        if (this.hubOrg) {
            const hubOrgId = this.hubOrg.getOrgId();
            this.ux.log(`My hub org id is: ${hubOrgId}`);
        }

        if (this.flags.force && this.args.file) {
            this.ux.log(`You input --force and a file: ${this.args.file as string}`);
        }

        const records = [];

        for (const record of result.records) {
            records.push(record);
        }

        result.records.forEach(element => {
            if(element.Id && element.Name){
                this.ux.log(element.Id+'   '+element.Name);
            }
        });

        // Return an object to be displayed with --json
        return { records };
    }
}
