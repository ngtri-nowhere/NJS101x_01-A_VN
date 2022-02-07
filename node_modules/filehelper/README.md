# filehelper

it is a npm package that provides fs function, with file existed check before file write.

[![NPM](https://nodei.co/npm/filehelper.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/filehelper)


## Install

```
$ npm install --save filehelper
```

## Usage

#### Writing a file:

 - replace the old one, while the file is existed
 - create new one, while the file is not existed

```js
var filehelper = require("filehelper")

var str = ' I love Peter 3';

filehelper.write('./data.json', str)
    .then( res=> {console.log('file is created');})
    
```


#### Read a file:

```js
var filehelper = require("filehelper")

filehelper.read('./data.json')
    .then( res=> {console.log(res)})
    
```



## License

MIT © [Waheng Chang](http://github.com/wahengchang)
