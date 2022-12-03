/* eslint-disable */

import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Org extends SfdxCommand {

    public static description = messages.getMessage('commandDescription');

    public static examples = [ `
        1. sfdx data:import -u yourorg@username.com -o "Contact,Lead" -p "path/to/contact.json,path/to/Lead.json"
    `];

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
        objects: flags.boolean({
            char: 'o',
            description: messages.getMessage('objectFlagDescription'),
        }),
        path: flags.boolean({
            char: 'p',
            description: messages.getMessage('pathDescription'),
        }),
}   ;

  // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise<AnyJson> {
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();

        let createdRecord = {};

        conn.sobject('Contact').create([
            {
                "attributes": {
                    "type": "Contact",
                    "referenceId": "ContactRef1"
                },
                "FirstName": "Amy",
                "LastName": "Taylor",
                "Title": "VP of Engineering",
                "Email": "amy@demo.net",
                "Phone": "4152568563"
            }
        ])
        .then( record => {
            createdRecord = record;
            this.ux.log(`Records imported`);
        })
        .catch( error => {
            this.ux.error(`Error occured while importing the data to contact --> ${error.message} `);
        });

        // Return an object to be displayed with --json
        return { createdRecord };
    }
}
