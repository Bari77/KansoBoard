var FILE_ENCODING = 'utf-8';
var fs = require('fs');
var path = require('path');
var DELAY_BETWEEN_CONCAT_MS = 100;
var REFERENCE_LANGUAGE = 'fr';
var ANSI_RESET = '\u001b[0m';
var ANSI_GRAY = '\u001b[90m';
var ANSI_INFO = '\u001b[96m';
var ANSI_YELLOW = '\u001b[33m';
var ANSI_RED = '\u001b[31m';
var ANSI_APPLE_GREEN = '\u001b[92m';
var hasActiveInfoLine = false;
var dest = './src/assets/i18n/';

async function run() {
    logTranslation('Concatenation of files...');

    var languages = getLanguageFolders();
    var total = languages.length;
    var parseResult = parseLanguageFiles(languages);

    if (parseResult.hasErrors) {
        logError('Concatenation stopped due to JSON format errors', 'Translation');
        process.exit(1);
    }

    for (var i = 0; i < total; i++) {
        var language = languages[i];
        logInfo('[' + (i + 1) + '/' + total + '] Concatenation of file: ' + language.dst + '.json');
        writeConcatenatedLanguageFile(language.dst, parseResult.outputsByLanguage[language.dst]);

        if (i < total - 1) {
            await sleep(DELAY_BETWEEN_CONCAT_MS);
        }
    }

    validateLanguageKeys(parseResult.outputsByLanguage);

    logSuccess('Concatenation finished successfully (' + total + ' languages concatenated)');
    process.exit(0);
}

run().catch(function (error) {
    logError('Unexpected error: ' + error.message);
    process.exit(1);
});

function getLanguageFolders() {
    return fs
        .readdirSync(dest, { withFileTypes: true })
        .filter(function (entry) {
            return entry.isDirectory();
        })
        .map(function (entry) {
            return {
                src: path.join(dest, entry.name),
                dst: entry.name
            };
        })
        .sort(function (a, b) {
            return a.dst.localeCompare(b.dst);
        });
}

function parseLanguageFiles(languages) {
    var outputsByLanguage = {};
    var hasErrors = false;

    languages.forEach(function (language) {
        var files = fs.readdirSync(language.src).filter(function (filePath) {
            return path.extname(filePath).toLowerCase() === '.json';
        });
        var mergedLanguageContent = {};

        files.forEach(function (filePath) {
            var fullPath = path.join(language.src, filePath);
            var temp = fs.readFileSync(fullPath, FILE_ENCODING).trim();

            try {
                var jsonContent = JSON.parse(temp);
                Object.assign(mergedLanguageContent, jsonContent);
            } catch (e) {
                logError(fullPath + '\n\t--> ' + e.message, 'Error');
                hasErrors = true;
            }
        });

        outputsByLanguage[language.dst] = mergedLanguageContent;
    });

    return {
        outputsByLanguage: outputsByLanguage,
        hasErrors: hasErrors
    };
}

function writeConcatenatedLanguageFile(languageCode, content) {
    var distPath = path.resolve(dest + languageCode + '.json');
    fs.writeFileSync(distPath, JSON.stringify(content, null, 4), FILE_ENCODING);
}

/**
 * Returns all key paths (e.g. ["ERROR.ERR_PET", "PETS.TITLE"]) in obj.
 * Only descends into plain objects; leaf values are represented by their path.
 */
function getAllKeyPaths(obj, prefix) {
    prefix = prefix || '';
    var paths = [];
    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var path = prefix ? prefix + '.' + key : key;
        var value = obj[key];

        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            paths.push.apply(paths, getAllKeyPaths(value, path));
        } else {
            paths.push(path);
        }
    }

    return paths;
}

/**
 * Gets the value at a dot-separated path in obj (e.g. "ERROR.ERR_PET").
 */
function getValueAtPath(obj, path) {
    var parts = path.split('.');
    var current = obj;
    for (var j = 0; j < parts.length; j++) {
        if (current == null || typeof current !== 'object') {
            return undefined;
        }
        current = current[parts[j]];
    }
    return current;
}

function hasKeyAtPath(obj, path) {
    return getValueAtPath(obj, path) !== undefined;
}

function validateLanguageKeys(outputsByLanguage) {
    var referenceContent = outputsByLanguage[REFERENCE_LANGUAGE];

    if (!referenceContent) {
        logWarning('Missing reference language: ' + REFERENCE_LANGUAGE + '.json. Key checks skipped.', 'Warning');
        return;
    }

    var referencePaths = getAllKeyPaths(referenceContent);
    referencePaths.sort();

    Object.keys(outputsByLanguage).forEach(function (languageCode) {
        if (languageCode === REFERENCE_LANGUAGE) {
            return;
        }

        var languageContent = outputsByLanguage[languageCode];
        var languagePaths = getAllKeyPaths(languageContent);
        languagePaths.sort();

        var pathsMissingFromLanguage = referencePaths.filter(function (path) {
            return !hasKeyAtPath(languageContent, path);
        });
        var pathsExtraInLanguage = languagePaths.filter(function (path) {
            return !hasKeyAtPath(referenceContent, path);
        });

        if (pathsMissingFromLanguage.length > 0 || pathsExtraInLanguage.length > 0) {
            logWarning('Key mismatch with ' + REFERENCE_LANGUAGE + '.json for ' + languageCode + '.json', 'Warning');
            logWarning('\tMissing keys (' + pathsMissingFromLanguage.length + '): ' + formatKeyList(pathsMissingFromLanguage));
            logWarning('\tExtra keys (' + pathsExtraInLanguage.length + '): ' + formatKeyList(pathsExtraInLanguage));
        }
    });
}

function formatKeyList(keys) {
    if (keys.length === 0) {
        return '(none)';
    }

    return keys.sort().join(', ');
}

function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function canRewriteCurrentLine() {
    return process.stdout.isTTY && typeof process.stdout.clearLine === 'function' && typeof process.stdout.cursorTo === 'function';
}

function clearActiveInfoLine() {
    if (!hasActiveInfoLine) {
        return;
    }

    if (canRewriteCurrentLine()) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
    } else {
        process.stdout.write('\n');
    }

    hasActiveInfoLine = false;
}

function logTranslation(message) {
    clearActiveInfoLine();
    console.log(ANSI_INFO + '[Translation] ' + message + ANSI_RESET);
}

function logInfo(message) {
    if (!canRewriteCurrentLine()) {
        console.log(ANSI_GRAY + '[Translation] ' + message + ANSI_RESET);
        return;
    }

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(ANSI_GRAY + '[Translation] ' + message + ANSI_RESET);
    hasActiveInfoLine = true;
}

function logSuccess(message) {
    clearActiveInfoLine();
    console.log(ANSI_APPLE_GREEN + '[Translation] ' + message + ANSI_RESET);
}

function logWarning(message, title, newLine = false) {
    clearActiveInfoLine();
    console.log((newLine ? '\n' : '') + ANSI_YELLOW + (title ? '[' + title + '] ' : '') + message + ANSI_RESET);
}

function logError(message, title, newLine = false) {
    clearActiveInfoLine();
    console.log((newLine ? '\n' : '') + ANSI_RED + (title ? '[' + title + '] ' : '') + message + ANSI_RESET);
}