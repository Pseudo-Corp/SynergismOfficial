const { readFileSync, writeFileSync } = require('fs');

const SynergismCss = `${__dirname}/../Synergism.css`;
// https://stackoverflow.com/a/41407246/15299271

try {
    const css = readFileSync(SynergismCss, 'utf-8');
    const cssLines = css.split('\n');

    const idx = cssLines.findIndex(l => l.startsWith('body {'));
    
    if (idx === -1) {
        throw new Error('body { element not found in CSS!');
    }

    console.log(`\x1b[33m%s\x1b[0m`, `Found body element index: ${idx}.`);
    cssLines.splice(idx + 1, 0, `\ttransform: scale(0.8, 0.8);`);
    writeFileSync(SynergismCss, cssLines.join('\n'));
    console.log(`\x1b[32m%s\x1b[0m`, `Wrote Synergism.css file with transform property!`);
} catch (e) {
    console.log(e);
    process.exit(1);
}