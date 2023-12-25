const {readFileSync, writeFileSync} = require('fs');

const currentDate = new Date();
const UTC = `Date.UTC(${currentDate.getUTCFullYear()}, ${currentDate.getUTCMonth()}, ${currentDate.getUTCDate()}, ${currentDate.getUTCHours()}, ${currentDate.getUTCMinutes()}, ${currentDate.getUTCSeconds()})`;
console.log('\x1b[33m%s\x1b[0m', `Updating last updated config date to ${UTC}`);


try {
    console.log('\x1b[33m%s\x1b[0m', 'Reading file & updating ##LAST_UPDATED##')
    let config = readFileSync(`${__dirname}/../src/Config.ts`, 'utf-8');

    if (!/'##LAST_UPDATED##'/g.test(config)) {
        throw new Error('File does not contain the \'##LAST_UPDATED##\' placeholder');
    }

    config = config.replace(/'##LAST_UPDATED##'/g, UTC);

    if (!/Date\.UTC\(/g.test(config)) {
        throw new Error('Couldn\'t replace the placeholder');
    }

    console.log('\x1b[33m%s\x1b[0m', 'writing file back to source')
    writeFileSync(`${__dirname}/../src/Config.ts`, config);
    console.log('\x1b[32m%s\x1b[0m', 'Date updated');
} catch (e) {
    console.error(e);
    process.exit(1);
}

try {
    console.log('Update like prod, maaaan')
    const config = readFileSync(`${__dirname}/../src/Config.ts`, 'utf-8')
        .replace('const prod: boolean = false', 'const prod: boolean = true')

    writeFileSync(`${__dirname}/../src/Config.ts`, config)
} catch (e) {
    console.log('maaaaaan that sucks!', e)
    process.exit(1)
}