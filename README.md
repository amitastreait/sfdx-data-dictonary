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


```sh-session
$ npm install -g sfdx-data-dictonary
$ sfdx COMMAND
running command...
$ sfdx (--version)
sfdx-data-dictonary/0.0.1 win32-x64 node-v16.13.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx data:dictonary [-n <string>] [-f] [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-datadictonary--n-string--f--p-string--o-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

* [`sfdx code:coverage [-n <string>] [-f] [-a] [-c] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-codecoverage--n-string--f--a--c--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

* [`sfdx perm:list -n <string> -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-permlist--n-string--o-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

* [`Thanks`](#thanks)

## `sfdx data:dictonary [-n <string>] [-f] [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

generates the metadata for the selected object and exports as slsx format

```
USAGE
  $ sfdx data:dictonary [-n <string>] [-f] [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion
    <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -f, --force                                                                       example boolean flag
  -n, --name=<value>                                                                name to print
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
  generates the metadata for the selected object and exports as slsx format

EXAMPLES
    sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead" -p "/path/to/file/file.xlsx"
    sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead"
```

## `Screenshot of output`
![OjbectPermissions](/.images/Information.png)
![FieldPermissions](/.images/FieldInformation.png)

## `sfdx code:coverage [-n <string>] [-f] [-a] [-c] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

runs and generate the code coverage in given format

```
USAGE
  $ sfdx code:coverage [-n <string>] [-f] [-a] [-c] [-v <string>] [-u <string>] [--apiversion <string>] [--json]
    [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -a, --aggregate                                                                   Use this flag, if you wanted to get
                                                                                    the aggregated code coverage by
                                                                                    components
  -c, --coverage                                                                    Use this flag, if you wanted to get
                                                                                    the code coverage by test methods
                                                                                    for components
  -f, --force                                                                       example boolean flag
  -n, --name=<value>                                                                name to print
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

## `sfdx perm:list -n <string> -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

lists all the permissions at profile level for the given object

```
USAGE
  $ sfdx perm list -n <string> -o <string> [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -n, --name=<value>                                                                (required) the name of the file to be written
  -o, --object=<value>                                                              (required) Name of the object to analyse
  -p, --format=<value>                                                              format in which you want to get the report. Valid values are xlsx & html
  -u, --targetusername=<value>                                                      username or alias for the target org;

  -v, --targetdevhubusername=<value>                                                username or alias for the dev hub org;

  --apiversion=<value>                                                              override the api version used for api requests made by this command
  --json                                                                            format output as json
  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for this command invocation

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
![OjbectPermissions](/.images/ObjectPermissions.png)
![FieldPermissions](/.images/FieldPermissions.png)

## `Thanks`
I would like to express my gratidute to [Jitendra Zaa Sir](https://github.com/JitendraZaa/Schema-Exporter) for guding me!
<!-- commandsstop -->
<!-- debugging-your-plugin -->
