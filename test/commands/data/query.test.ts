import { test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

describe('data:query', () => {
    test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest((request) => {
        const requestMap = ensureJsonMap(request);
        if (/Organization/.exec(ensureString(requestMap.url))) {
            return Promise.resolve({
                records: [
                    {
                        "attributes": {
                            "type": "Account",
                            "url": "/services/data/v56.0/sobjects/Account/0014x00000VrBg2AAF"
                        },
                        "Id": "0014x00000VrBg2AAF",
                        "Name": "SFDCPanther"
                    }
                ],
            });
        }
        return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['data:query', '--targetusername', 'test@org.com', '-q', 'Select Id, Name FROM Account LIMIT 1'])
    .it('runs data:query --targetusername test@org.com -q "Select Id, Name FROM Account LIMIT 1" --json', (ctx) => {
        /*
        expect(ctx.stdout).to.contain(
            'SFDCPanther'
        ); */
    });
});