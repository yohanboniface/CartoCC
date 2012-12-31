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
            "if": {
                "id": "thiswillmatch"
            },
            "then": {
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


function test_fieldpath_in_if_block_should_work() {
    var mml = {"Layer":[
        {
            "Datasource": {
                "field": "oldvalue"
            }
        }
    ]};
    var rules = [
        {
            "if": {
                "Datasource.field": "oldvalue"
            },
            "then": {
                "Datasource.field": "newvalue"
            }
        }
    ];
    var output = {"Layer":[
        {
            "Datasource": {
                "field": "newvalue"
            }
        }
    ]};
    _testOutput(mml, rules, output);
}


function test_only_first_rule_should_apply() {
    var mml = {"Layer":[
        {
            "id": "thiswillmatchfirst",
            "class": "thiswillmatchtoo",
            "Datasource": {
                "field": "oldvalue"
            }
        }
    ]};
    var rules = [
        {
            "if": {
                "id": "thiswillmatchfirst"
            },
            "then": {
                "Datasource.field": "this will be applied"
            }
        },
        {
            "if": {
                "class": "thiswillmatchtoo"
            },
            "then": {
                "Datasource.field": "this will not be applied"
            }
        }
    ];
    var output = {"Layer":[
        {
            "id": "thiswillmatchfirst",
            "class": "thiswillmatchtoo",
            "Datasource": {
                "field": "this will be applied"
            }
        }
    ]};
    _testOutput(mml, rules, output);
}

function test_two_conditions_must_be_both_true() {
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
            "if": {
                "id": "thiswillmatch",
                "Datasource.field": "oldvalue"
            },
            "then": {
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
    test_simple_output,
    test_fieldpath_in_if_block_should_work,
    test_only_first_rule_should_apply,
    test_two_conditions_must_be_both_true
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