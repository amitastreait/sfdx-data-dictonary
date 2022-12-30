/* eslint-disable*/
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

import { XMLParser } from 'fast-xml-parser';
const fs = require('fs');
import { readFileSync } from 'fs';

import { MetadataComponentDependencyResult } from '../../../models/metadataDependency'

const dir = './dependencies';
// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core, or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-data-dictonary', 'org');

export default class Generate extends SfdxCommand {
    public static description = messages.getMessage('commandMdGenerateDescription');

    public static examples =[`
    sfdx md:dependency:generate -x ./manifest/package.xml -u utils
    sfdx md:dependency:generate -x ./manifest/package.xml --path ./dependency/package.xml -u utils
    sfdx md:dependency:generate --manifest ./manifest/package.xml -u utils
    sfdx md:dependency:generate --manifest ./manifest/package.xml --path ./dependency/package.xml -u utils
    `]

    public static args = [{ name: 'file' }];

    protected static flagsConfig = {
        // flag with a value (-n, --name=VALUE)
        manifest: flags.string({
            char: 'x',
            description: messages.getMessage('manifestFlagDescription'),
            required: true
        }),
        path: flags.string({
            char: 'p',
            description: messages.getMessage('pthFlagDescription'),
            required: false
        }),
    };

    // Comment this out if your command does not require an org username
    protected static requiresUsername = true;

    // Comment this out if your command does not support a hub org username
    protected static supportsDevhubUsername = true;

    // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
    protected static requiresProject = false;

    public async run(): Promise<AnyJson> {
        // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
        const conn = this.org.getConnection();
        let manifest = this.flags.manifest;
        let filePath = this.flags.path;
        this.ux.startSpinner(`Reading ${manifest} file`);

        // create new directory
        try {
            // check if directory already exists
            if (!filePath && !fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        } catch (err) {
            //console.log(err);
        }
        // ${process.cwd()}/xml/books.xml
        //this.ux.log( `${process.cwd()}/${manifest}` );
        const xmlFile = readFileSync(`${manifest}`, 'utf8');
        const parser = new XMLParser();
        const json = parser.parse(xmlFile);
        
        if(json.Package && json.Package.types){
            let length = json.Package.types.length;
            for(let i=0; i< length; i++){
                let members = json.Package.types[i].members;
                if(members !== '*'){
                    let metaDataComponentType = `${json.Package.types[i].name}`;
                    this.ux.log(`Fetching the Metadata depenency for ${metaDataComponentType}`);
                    //this.ux.log(`Fetching the Metadata depenency for ${members}`);
                    
                    const dependencyQuery = `SELECT MetadataComponentName, MetadataComponentType,
                        RefMetadataComponentName, RefMetadataComponentType
                        FROM MetadataComponentDependency 
                        WHERE RefMetadataComponentType = '${metaDataComponentType}'
                    `;

                    /* RefMetadataComponentName & RefMetadataComponentType are the one which needs to be populated */
                    /* MetadataComponentName contans the name of component in Package.xml */
                    
                    const response = await conn.request(`/services/data/v56.0/tooling/query?q=${dependencyQuery}`);
                    const result = response as MetadataComponentDependencyResult;
                    //this.ux.log(` referencedComponents = ${JSON.stringify(referencedComponents || {} )}`);
                    if (result.records && result.records.length > 0) {
                        this.ux.log(`Preparing the Metadata depenency for ${metaDataComponentType}`);
                    }
                }
            }
            
        }

        const result = await conn.query(`SELECT Id, Name FROM Organization`);
        if (!result.records || result.records.length <= 0) {
            throw new SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
        }
        if(!filePath){
            filePath = `${dir}/package.xml`;
        }

        //this.ux.log(`the manifest file has been written to ${filePath} `);
        this.ux.stopSpinner(`the manifest file has been written to ${filePath} `);
        // Return an object to be displayed with --json
        return { message : `the manifest file has been written to ${filePath}` };
    }
}