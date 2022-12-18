SFDX Data Dictonary
===================

this is a custom plugin to generate the data dictonary for the selected objects

[![Version](https://img.shields.io/npm/v/sfdx-data-dictonary.svg)](https://npmjs.org/package/sfdx-data-dictonary)
[![CircleCI](https://circleci.com/gh/amitastreait/sfdx-data-dictonary/tree/master.svg?style=shield)](https://circleci.com/gh/amitastreait/sfdx-data-dictonary/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/amitastreait/sfdx-data-dictonary?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-data-dictonary/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/amitastreait/sfdx-data-dictonary.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/amitastreait/sfdx-data-dictonary/badge.svg)](https://snyk.io/test/github/amitastreait/sfdx-data-dictonary)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-data-dictonary.svg)](https://npmjs.org/package/sfdx-data-dictonary)
[![License](https://img.shields.io/npm/l/sfdx-data-dictonary.svg)](https://github.com/amitastreait/sfdx-data-dictonary/blob/master/package.json)

## Installation
```
sfdx plugins:install sfdx-data-dictonary
```

```sh-session
$ npm install -g sfdx-data-dictonary
$ sfdx COMMAND
running command...
$ sfdx (--version)
sfdx-data-dictonary/0.0.1 win32-x64 node-v16.13.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx data:dictonary --help
  $ sfdx code:coverage --help
  $ sfdx perm:list --help
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx code:coverage [-n <string>] [-a] [-c] [-p <string>] [-f <string>] [--wait <minutes>] [--notify <url>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-codecoverage--n-string--a--c--p-string--f-string---wait-minutes---notify-url--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx data:dictonary [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-datadictonary--p-string--o-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx field:usage -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-fieldusage--o-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx perm:list -n <string> -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-permlist--n-string--o-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx code:coverage [-n <string>] [-a] [-c] [-p <string>] [-f <string>] [--wait <minutes>] [--notify <url>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

runs and generate the code coverage in given format

```
USAGE
  $ sfdx code:coverage [-n <string>] [-a] [-c] [-p <string>] [-f <string>] [--wait <minutes>] [--notify <url>] [-v
    <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -a, --aggregate                                                                   Use this flag, if you wanted to get
                                                                                    the aggregated code coverage by
                                                                                    components
  -c, --coverage                                                                    Use this flag, if you wanted to get
                                                                                    the code coverage by test methods
                                                                                    for components
  -f, --format=<value>                                                              [default: table] format in which you
                                                                                    want to get the code coverage
                                                                                    report. Valid values are table, xlsx
                                                                                    & html
  -n, --name=<value>                                                                class name to get the coverage %
  -p, --file=<value>                                                                Fully qualified path with file name
                                                                                    where you want to store the code
                                                                                    coverage in xlsx/html format
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  -v, --targetdevhubusername=<value>                                                username or alias for the dev hub
                                                                                    org; overrides default dev hub org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
  --notify=<value>                                                                  url to notify upon completion
  --wait=<value>                                                                    number of minutes to wait for
                                                                                    creation

DESCRIPTION
  runs and generate the code coverage in given format

EXAMPLES
      sfdx code:coverage -u username@salesforce.com --aggregate
      sfdx code:coverage -u username@salesforce.com --aggregate --json
      sfdx code:coverage -u username@salesforce.com --aggregate --format xlsx --name AccountTriggerTest --file ./coverage/CoverageReport.xlsx
      sfdx code:coverage -u username@salesforce.com --aggregate --format xlsx --file ./coverage/CoverageReport.xlsx
      sfdx code:coverage -u username@salesforce.com --aggregate --format html --file ./coverage/CoverageReport.html
      sfdx code:coverage -u username@salesforce.com --aggregate --format table
      sfdx code:coverage -u username@salesforce.com --aggregate --format table --name AccountTriggerTest
```

_See code: [src/commands/code/coverage.ts](https://github.com/amitastreait/sfdx-data-dictonary/blob/v0.0.2/src/commands/code/coverage.ts)_

## `sfdx data:dictonary [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

generates the metadata for the selected object and exports as slsx format, medata includes object, field, apex trigger, record trigger flows & validation rules

```
USAGE
  $ sfdx data:dictonary [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json]
    [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -o, --objects=<value>                                                             Comma Seperated API name of objects
                                                                                    to get field metadata Info
  -p, --path=<value>                                                                File Name with full Path to create
                                                                                    Excel File
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  -v, --targetdevhubusername=<value>                                                username or alias for the dev hub
                                                                                    org; overrides default dev hub org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  generates the metadata for the selected object and exports as slsx format, medata includes object, field, apex
  trigger, record trigger flows & validation rules

EXAMPLES
          sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead" -p "./path/to/file/file.xlsx"
          sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead"
          sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead" --json
```

_See code: [src/commands/data/dictonary.ts](https://github.com/amitastreait/sfdx-data-dictonary/blob/v0.0.2/src/commands/data/dictonary.ts)_

## `sfdx field:usage -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

analyse the field usage for a given object and generates a report

```
USAGE
  $ sfdx field:usage -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json]
    [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -o, --object=<value>                                                              (required) Name of the object to
                                                                                    analyse
  -p, --path=<value>                                                                full Path to generate the repor file
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  -v, --targetdevhubusername=<value>                                                username or alias for the dev hub
                                                                                    org; overrides default dev hub org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  analyse the field usage for a given object and generates a report

EXAMPLES
          sfdx field:usage -u username-alias -o "Account"
          sfdx field:usage -u username-alias -o "Account" -p "./path/to/report/folder"
```

_See code: [src/commands/field/usage.ts](https://github.com/amitastreait/sfdx-data-dictonary/blob/v0.0.2/src/commands/field/usage.ts)_

## `sfdx perm:list -n <string> -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

list all the permissions at profile level for the given object & it's all fields

```
USAGE
  $ sfdx perm:list -n <string> -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>]
    [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                (required) the name of the file to
                                                                                    be written
  -o, --object=<value>                                                              (required) Name of the object to
                                                                                    analyse
  -p, --format=<value>                                                              format in which you want to get the
                                                                                    report. Valid values are xlsx & html
  -u, --targetusername=<value>                                                      username or alias for the target
                                                                                    org; overrides default target org
  -v, --targetdevhubusername=<value>                                                username or alias for the dev hub
                                                                                    org; overrides default dev hub org
  --apiversion=<value>                                                              override the api version used for
                                                                                    api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

DESCRIPTION
  list all the permissions at profile level for the given object & it's all fields

EXAMPLES
      sfdx perm:list -u utils -o "Account" --json
      sfdx perm:list -u utils -o "Account"
      sfdx perm:list -u utils -o "Account" -n ObjectPermissions.html --format html
      sfdx perm:list -u utils -o "Account" -n ObjectPermissions.xlsx --format xlsx
      sfdx perm:list -u utils -o "Account" -n ObjectPermissions.xlsx
      sfdx perm:list -u utils -o "Account" -n ObjectPermissions.html
```

_See code: [src/commands/perm/list.ts](https://github.com/amitastreait/sfdx-data-dictonary/blob/v0.0.2/src/commands/perm/list.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
