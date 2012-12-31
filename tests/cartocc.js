require('../cartocc.js');
var assert = require('assert');

/*
* @param mml    json
* @param rules  json
* @param output json
*/
function _testOutput (mml, rules, output) {
    var c = new C(JSON.stringify(mml), JSON.stringify(rules));
    c.process();
    assert.deepEqual(c.mml, output, "match");
}

/* Simple output test */
function test_simple_output() {
    var mml = {"Layer":[
        {
            "id": "thiswillmatch",
            "Datasource": {
                "field": "oldvalue"
            }
        },
        {
            "id": "thiswillnotmatch",
            "Datasource": {
                "field": "oldvalue"
            }
        }
    ]};
    var rules = [
        {
            "if_field": "id",
            "has_value": "thiswillmatch",
            "then_use": {
                "Datasource.field": "newvalue"
            }
        }
    ];
    var output = {"Layer":[
        {
            "id": "thiswillmatch",
            "Datasource": {
                "field": "newvalue"
            }
        },
        {
            "id": "thiswillnotmatch",
            "Datasource": {
                "field": "oldvalue"
            }
        }
    ]};
    _testOutput(mml, rules, output);
}

var to_run = [
    test_simple_output
];
Object.keys(to_run).forEach(function (key) {
    try {
        to_run[key]();
        console.log(to_run[key], "passed");
    }
    catch (err) {
        console.log(to_run[key], "fail");
        console.log(err);
    }
});