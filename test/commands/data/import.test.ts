import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

describe('data:import', () => {
    test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest((request) => {
        const requestMap = ensureJsonMap(request);
        if (/Organization/.exec(ensureString(requestMap.url))) {
            return Promise.resolve({
                records: {
                    "status": 0,
                    "result": {
                        "orgId": "00D4x000002ypneEAA",
                        "message": "Excel File created at - ObjectInfo.xlsx "
                    }
                },
            });
        }
        return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['data:import', '--targetusername', 'test@org.com'])
    .it('runs data:import --targetusername test@org.com --json', (ctx) => {
        expect(ctx.stdout).to.contain(
            ''
        );
    });
});