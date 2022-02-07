'use strict';

var fs = require('fs');
var path = require('path');

var fileList = function fileList(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readdir(filePath, function (err, files) {
            if (err) resolve([]);else resolve(files);
        });
    });
};

var _parseFilePath = function _parseFilePath(fullFileName) {
    var t = fullFileName.split('/');
    var _fileName = t[t.length - 1];
    t.pop();

    var _filePath = t.join('/');

    return { _fileName: _fileName, _filePath: _filePath };
};

var _checkAndCreateFile = function _checkAndCreateFile(fullFileName) {
    var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return new Promise(function (resolve, reject) {
        var _parseFilePath2 = _parseFilePath(fullFileName),
            _fileName = _parseFilePath2._fileName,
            _filePath = _parseFilePath2._filePath;

        var isExisted = false;

        fileList(_filePath).then(function (files) {

            isExisted = files.some(function (_file) {
                return _file === _fileName;
            });

            isExisted ? console.log(' file is already existed ') : console.log(' file is not existed , going to create');

            return _write(_fileName, str);
        }).then(function () {
            return resolve();
        });
    });
};

var _write = function _write(fullFileName) {
    var str = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    return new Promise(function (resolve, reject) {
        fs.writeFile(fullFileName, str, function (err) {
            if (err) reject(err);else resolve();
        });
    });
};

var _read = function _read(fullFileName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fullFileName, 'utf8', function (err, data) {
            if (err) reject(err);else resolve(data);
        });
    });
};

module.exports = {
    write: _checkAndCreateFile,
    read: _read,
    fileList: fileList
};
