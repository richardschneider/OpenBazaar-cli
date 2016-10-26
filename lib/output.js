'use strict';

const app = require('./app');

class Output {
    constructor(options) {
        this.options = options || {};
    }

    result(v) {
        if (this.options.xml) {
            this.error('XML output NYI');
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

    error(s) {
        console.log('Error', s);
    }

    info(s) {
        console.log(s);
    }

    debug(s) {
        console.log(s);
    }
}


module.exports = new Output(app.options);
