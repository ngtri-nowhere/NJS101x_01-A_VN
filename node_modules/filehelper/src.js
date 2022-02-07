var fs = require('fs')
var path = require('path')

var fileList = (filePath) => new Promise((resolve, reject)=>{
    fs.readdir(filePath, (err, files) => {
        if(err)
            resolve([])
        else
            resolve(files)
    })
})

var _parseFilePath = (fullFileName) => {
    var t = fullFileName.split('/')
    var _fileName = t[t.length-1]
    t.pop()

    var _filePath = t.join('/')

    return {_fileName, _filePath}
}

var _checkAndCreateFile = (fullFileName, str = '') => new Promise((resolve, reject)=>{

    var {_fileName, _filePath} = _parseFilePath(fullFileName)
    var isExisted = false;

    fileList(_filePath)
        .then(files => {
            
            isExisted = files.some( _file => _file === _fileName)

            isExisted ? 
                console.log(' file is already existed ') :
                console.log(' file is not existed , going to create');

            return _write(_fileName, str)

        })
        .then( ()=> resolve())
})


var _write = (fullFileName, str = '') => new Promise((resolve, reject)=>{
    fs.writeFile(fullFileName, str, (err) => {
        if(err) 
            reject(err)
        else
            resolve()
    });
})


var _read = (fullFileName) => new Promise((resolve, reject)=>{
    fs.readFile(fullFileName, 'utf8', (err, data) => {
        if(err) 
            reject(err)
        else
            resolve(data)
    });
})

module.exports = {
    write : _checkAndCreateFile,
    read : _read,
    fileList: fileList,
}