'use strict';

const app = require('./app');
const xml2js = require('xml2js');

app.commander
    .option('--json', 'output result as JSON (default if object/array)')
    .option('--text', 'output result as plain text (default if not object/array)')
    // TODO: .option('--csv', 'output result as CSV')
    .option('--xml', 'output result as XML')
    ;

class Output {
    constructor(options) {
        this.options = options || {};
    }

    result(v) {
        if (this.options.xml) {
            let builder = new xml2js.Builder(),
                s = builder.buildObject(v);
            process.stdout.write(s);
        } else if (this.options.csv) {
            this.error('CSV output NYI');
        } else if (this.options.text) {
            process.stdout.write(v.toString());
        } else if (this.options.json) {
            let s = JSON.stringify(v, null, this.options.indent || 2);
            process.stdout.write(s);
        } else {
            if (typeof v === 'object') {
                let s = JSON.stringify(v, null, this.options.indent || 2);
                process.stdout.write(s);
            } else {
                process.stdout.write(v.toString());
            }
        }
    }
}


module.exports = new Output(app.options);
