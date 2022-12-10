import { test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

describe('field:usage', () => {
    test
    .withOrg({ username: 'test@org.com' }, true)
    .withConnectionRequest((request) => {
        const requestMap = ensureJsonMap(request);
        if (/Organization/.exec(ensureString(requestMap.url))) {
            return Promise.resolve({
            records: [
                {
                Name: 'Super Awesome Org',
                TrialExpirationDate: '2018-03-20T23:24:11.000+0000',
                },
            ],
            });
        }
        return Promise.resolve({ records: [] });
    })
    .stdout()
    .command(['field:usage', '--targetusername', 'test@org.com', 'o', 'Account'])
    .it('runs field:usage --targetusername test@org.com --json', (ctx) => {
    });
});
