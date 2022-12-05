import { test } from '@salesforce/command/lib/test'; // expect
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

describe('code:coverage', () => {
    test.withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest((request) => {
    const requestMap = ensureJsonMap(request);
        if (/Organization/.exec(ensureString(requestMap.url))) {
            return Promise.resolve({
                records: [
                    {
                        "attributes": {
                            "type": "ApexCodeCoverageAggregate",
                            "url": "/services/data/v56.0/tooling/sobjects/ApexCodeCoverageAggregate/7154x000000hOLxAAM"
                        },
                        "NumLinesCovered": 0,
                        "NumLinesUncovered": 168,
                        "Coverage": {
                            "coveredLines": [],
                            "uncoveredLines": []
                        },
                        "ApexClassOrTrigger": {
                            "attributes": {
                            "type": "Name",
                            "url": "/services/data/v56.0/tooling/sobjects/ApexClass/01p4x000008umoUAAQ"
                            },
                            "Name": "CustomMetadataUploader"
                        }
                    }
                ],
            });
        }
        return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['code:coverage', '--targetusername', 'test@org.com'])
    .it('runs code:coverage --targetusername test@org.com --json', (ctx) => {

    });
});
