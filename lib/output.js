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
        } else { // default to JSON
            let s = JSON.stringify(v, null, this.options.indent || 2);
            process.stdout.write(s);
            process.stdout.write('\n');
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
