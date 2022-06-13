const vscode = require('vscode');
const child_process = require('child_process');

const binaryMinimumVersion = '0.0.4';

module.exports = {
    isCompatible,
    getBinaryVersion,
    getMinimumVersion,
};

/**
 * 
 * @param {string} currentVer 
 * @returns bool
 */
function isCompatible(currentVer) {
    let m = {
        minimum: binaryMinimumVersion.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/),
        current: `${currentVer}`.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/),
    };
    if (m.minimum == null || m.current == null) {
        throw new Error(`cannot parse version / minimum: ${m.minimum}, current: ${m.current}`);
    }
    new Map([
        ['major', [m.minimum.groups.major, m.current.groups.minor]],
        ['minor', [m.minimum.groups.minor, m.current.groups.minor]],
        ['patch', [m.minimum.groups.patch, m.current.groups.patch]]
    ]).forEach(function (_, v) {
        if (v[0] < v[1]) {
            return true;
        }
        else if (v[0] > v[1]) {
            return false;
        }
    });
    return true;
}

/**
 * 
 * @param {vscode.WorkspaceConfiguration} config 
 * @returns string
 */
function getBinaryVersion(config) {
    return child_process.execSync(`${config.binPath} -v`).toString();
}

/**
 * @returns string
 */
function getMinimumVersion() {
    return binaryMinimumVersion;
}
