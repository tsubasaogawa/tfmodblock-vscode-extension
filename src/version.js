const vscode = require('vscode'); // eslint-disable-line
const child_process = require('child_process');

const binaryMinimumVersion = '0.0.4';
const sortableVersion = '0.0.9';
const useDefaultVersion = '0.0.13';
const extensionVersion = '0.0.6';

module.exports = {
    isCompatible,
    getBinaryVersion,
    binaryMinimumVersion,
    sortableVersion,
    useDefaultVersion,
    extensionVersion,
};

/**
 * 
 * @param {string} currentVer 
 * @param {string} minimumVer
 * @returns bool
 */
function isCompatible(currentVer, minimumVer = binaryMinimumVersion) {
    let m = {
        minimum: minimumVer.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/),
        current: currentVer.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/),
    };
    if (m.minimum == null || m.current == null) {
        throw new Error(`cannot parse version / minimum: ${m.minimum}, current: ${m.current}`);
    }

    for (const v of [
        [m.minimum.groups.major, m.current.groups.major],
        [m.minimum.groups.minor, m.current.groups.minor],
        [m.minimum.groups.patch, m.current.groups.patch]
    ]) {
        if (v[0] == v[1]) {
            continue;
        }
        return parseInt(v[0]) < parseInt(v[1]);
    }
    return true;
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns string
 */
function getBinaryVersion(config) {
    return child_process.execSync(`${config.binPath} -v`).toString().trim();
}
