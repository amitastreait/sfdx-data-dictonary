sfdx-data-dictonary
===================

this is a custom plugin to generate the data dictonary for the selected objects

[![Version](https://img.shields.io/npm/v/sfdx-data-dictonary.svg)](https://npmjs.org/package/sfdx-data-dictonary)
[![CircleCI](https://circleci.com/gh/amitastreait/sfdx-data-dictonary/tree/master.svg?style=shield)](https://circleci.com/gh/amitastreait/sfdx-data-dictonary/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/amitastreait/sfdx-data-dictonary?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-data-dictonary/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/amitastreait/sfdx-data-dictonary.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/amitastreait/sfdx-data-dictonary/badge.svg)](https://snyk.io/test/github/amitastreait/sfdx-data-dictonary)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-data-dictonary.svg)](https://npmjs.org/package/sfdx-data-dictonary)
[![License](https://img.shields.io/npm/l/sfdx-data-dictonary.svg)](https://github.com/amitastreait/sfdx-data-dictonary/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-data-dictonary
$ sfdx COMMAND
running command...
$ sfdx (--version)
sfdx-data-dictonary/0.0.1 win32-x64 node-v16.13.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx data:dictonary [-n <string>] [-f] [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-datadictonary--n-string--f--p-string--o-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx data:query -q <string> [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dataquery--q-string--n-string--f--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-helloorg--n-string--f--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx test:coverage [-n <string>] [-f] [-a] [-c] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-testcoverage--n-string--f--a--c--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx data:dictonary [-n <string>] [-f] [-p <string>] [-o <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

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
  print a greeting and your org IDs

EXAMPLES
      sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead" -p "/path/to/file/file.xlsx"
      sfdx data:dictonary -u yourorg@salesforec.com -o "Account,Lead"
```

## `sfdx data:query -q <string> [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
USAGE
  $ sfdx data:query -q <string> [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json]
    [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
  -f, --force                                                                       example boolean flag
  -n, --name=<value>                                                                name to print
  -q, --query=<value>                                                               (required) name to query
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
  print a greeting and your org IDs

EXAMPLES
  $ sfdx hello:org --targetusername myOrg@example.com --targetdevhubusername devhub@org.com

  $ sfdx hello:org --name myname --targetusername myOrg@example.com
```

## `sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
USAGE
  $ sfdx hello:org [-n <string>] [-f] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel
    trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

FLAGS
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
  print a greeting and your org IDs

EXAMPLES
  $ sfdx hello:org --targetusername myOrg@example.com --targetdevhubusername devhub@org.com

  $ sfdx hello:org --name myname --targetusername myOrg@example.com
```


## `sfdx test:coverage [-n <string>] [-f] [-a] [-c] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

print a greeting and your org IDs

```
USAGE
  $ sfdx test:coverage [-n <string>] [-f] [-a] [-c] [-v <string>] [-u <string>] [--apiversion <string>] [--json]
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
  print a greeting and your org IDs

EXAMPLES
          sfdx data:coverage -u utils -c
          sfdx data:coverage -u utils -c --json
          sfdx data:coverage -u utils -a --json
          sfdx data:coverage -u utils -a
```
<!-- commandsstop -->
<!-- debugging-your-plugin -->
