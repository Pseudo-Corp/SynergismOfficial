const {readFileSync, writeFileSync} = require('fs');

const currentDate = new Date();
const UTC = `Date.UTC(${currentDate.getUTCFullYear()}, ${currentDate.getUTCMonth()}, ${currentDate.getUTCDate()}, ${currentDate.getUTCHours()}, ${currentDate.getUTCMinutes()}, ${currentDate.getUTCSeconds()})`;
console.log('\x1b[33m%s\x1b[0m', `Updating last updated config date to ${UTC}`);


try {
    console.log('\x1b[33m%s\x1b[0m', 'Reading file & updating ##LAST_UPDATED##')
    let config = readFileSync(`${__dirname}/src/Config.ts`).toString();

    if (!config.match(/'##LAST_UPDATED##'/g)) {
        throw new Error('File does not contain the \'##LAST_UPDATED##\' placeholder');
    }

    config = config.replace(/'##LAST_UPDATED##'/g, UTC);

    if (!config.match(/Date\.UTC\(/g)) {
        throw new Error('Couldn\'t replace the placeholder');
    }

    console.log('\x1b[33m%s\x1b[0m', 'writing file back to source')
    writeFileSync(`${__dirname}/src/Config.ts`, Buffer.from(config));
    console.log('\x1b[32m%s\x1b[0m', 'Date updated');
} catch (e) {
    console.error(e);
    process.exit(1);
}
