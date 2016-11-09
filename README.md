# OpenBazaar-cli 

[![Travis build status](https://travis-ci.org/richardschneider/OpenBazaar-cli.svg)](https://travis-ci.org/richardschneider/OpenBazaar-cli)
[![npm version](https://badge.fury.io/js/OpenBazaar-cli.svg)](https://badge.fury.io/js/OpenBazaar-cli) 

Command line tool for [Open Bazaar](https://openbazaar.org).  Manages your local or remote OB server.

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm), to create the `ob` tool on your computer.

    > npm install -g OpenBazaar-cli

Show your profile

    > ob profile ls
    
## Usage

    > ob --help

````
  Usage: ob <cmd> [<args>]

  Commands:

    config <action> [<args>]   manage the open bazaar configuration
    profile <action> [<args>]  manage the open bazaar profile
    setting <action> [<args>]  manage the open bazaar settings
    listing <action> [<args>]  manage the open bazaar listings
    forex <action> [<args>]    manage the open bazaar foreign exchange
    help [cmd]                 display help for [cmd]

  Open Bazaar tool

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

````

### Data

Use the **list** action to get all the data associated with the command

    > ob profile list

Generates the following on my server
````
{
  "social_accounts": {},
  "moderation_fee": 0,
  "moderator": false,
  "nsfw": false,
  "vendor": true,
  "guid": "e53ce6c8dc2f7faadb1c7a06151aac664750c6d8",
  "background_color": 11711154,
  "secondary_color": 15132390,
  "location": "NEW_ZEALAND",
  "short_description": "g'day mate",
  "primary_color": 16777215,
  "email": "",
  "website": "",
  "handle": "",
  "text_color": 5526612,
  "last_modified": 1478398834,
  "public_key": "37ffdced301005f95284cd676a2654400f29bea9b12a39abd46dee1f47f8008c",
  "about": "G'day mate",
  "name": "Makaretu",
  "header_hash": "1ae6defda624a48b1fc53d4598a173508318df59",
  "pgp_key": "",
  "avatar_hash": ""
}
````

Many of the commands allow changing the data, using the **set** action.

    > ob profile set about "G'day mate" 

### Map

Display a map of your peers

    > ob peers --map >map.html
    > map.html
    