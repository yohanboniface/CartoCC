#!/usr/bin/env node

var fs = require('fs');
var args = process.argv.slice(2);
if (args.length < 2) {
    help();
    process.exit(1);
}
var cartoFile = args[0];
var configFile = args[1];

function help () {
    console.log('Usage: node cartocc.js <path-to-project.mml> <path-to-config.json>');
}

C = function (mmlPath, configPath) {
    var rulestring = fs.readFileSync(configFile);
    var mmlstring = fs.readFileSync(cartoFile);
    this.rules = JSON.parse(rulestring);
    this.mml = JSON.parse(mmlstring);
};

C.prototype.process = function() {
    for (var x in this.mml.Layer) {
        if (typeof this.mml.Layer[x].Datasource !== "undefined") {
            this.customizeLayer(this.mml.Layer[x]);
        }
    }
};

C.prototype.customizeLayer = function(layer) {
    var rule,
        field;
    for (var idx in this.rules) {
        rule = this.rules[idx];
        if (this.layerHasValue(layer, rule.if_field, rule.has_value)) {
            for (var fieldpath in rule.then_use) {
                this.setLayerValue(layer, fieldpath, rule.then_use[fieldpath]);
            }
        }
    }
};

C.prototype.layerHasValue = function (layer, fieldpath, value) {
    var path_elements = fieldpath.split('.'),
        field = layer;
    for (var el in path_elements) {
        if (typeof field === "undefined") {
            break;
        }
        field = field[path_elements[el]];
    }
    return field == value;
};

C.prototype.setLayerValue = function(layer, fieldpath, value) {
    var path_elements = fieldpath.split('.'),
        field = layer;
    for (var el in path_elements) {
        if (typeof field === "undefined") {
            break;
        }
        if (typeof field[path_elements[el]] === "object") {
            field = field[path_elements[el]];
        }
        else {
            field[path_elements[el]] = value;
        }
    }
};

C.prototype.output = function () {
    process.stdout.write(JSON.stringify(this.mml));
};

c = new C(cartoFile, configFile);
c.process();
c.output();