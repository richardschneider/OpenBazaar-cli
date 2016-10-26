const commander = require('commander');

module.exports = {
    commander: commander,
    options: commander, // command line options
    version: (require('../package.json')).version || '0.0.42'
};
