var FILE_ENCODING = 'utf-8';
var fs = require('fs');
var path = require('path');
var withError = false;

console.log('[Translation] Concat files...');

var dest = './src/assets/i18n/';
EOL = '\n';
var fr = {
    src: './src/assets/i18n/fr/',
    dst: 'fr'
};
console.log(path.resolve(fr.src));
var en = {
    src: './src/assets/i18n/en/',
    dst: 'en'
};

function concat(opts) {
    var distPath = path.resolve(dest + opts.dst + '.json');
    console.log(path.resolve(distPath));
    var files = fs.readdirSync(opts.src);

    var out = {};

    files.forEach(function (filePath) {
        var temp = fs.readFileSync(opts.src + filePath, FILE_ENCODING).trim();

        try {
            var jsonContent = JSON.parse(temp);
            Object.assign(out, jsonContent);
        } catch (e) {
            console.log('\u001b[' + 31 + 'm' + 'Error in file : ' + filePath + ' --> ' + e.message + '\u001b[0m');
            withError = true;
        }
    });

    fs.writeFileSync(distPath, JSON.stringify(out, null, 4), FILE_ENCODING);
}

concat(fr);
// concat(en);

if (withError) {
    process.exit(1);
}

console.log("[Translation] Concat ended");
process.exit(0);