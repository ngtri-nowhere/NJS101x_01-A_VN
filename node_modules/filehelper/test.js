var fsModule = require('./index.js');
var assert = require('assert');

describe('fs write ', function(){
    var str = ' I love Peter 3';

    it('fsModule.write: ', (done)=> {
        fsModule.write('./data.json', str)
            .then( res=> {done();})
    })
    
    it('fsModule.read: ', (done)=> {
        fsModule.read('./data.json')
            .then( data=> {assert.equal(data, str); done();})
    })

});