C = function (mml, rules) {
    this.rules = typeof rules === "string" ? JSON.parse(rules) : rules;
    this.mml = typeof mml === "string" ? JSON.parse(mml) : mml;
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
        fieldpath,
        matched,
        value,
        flatLayer = this.flatenLayer(layer);
    for (var idx in this.rules) {
        rule = this.rules[idx];
        // must pass every condition
        matched = false;
        for (fieldpath in rule['if']) {
            if (this.layerHasValue(layer, fieldpath, rule['if'][fieldpath])) {
                matched = true;
            }
            else {
                matched = false;
                break;
            }
        }
        if (matched) {
            for (fieldpath in rule.then) {
                value = this.format(rule.then[fieldpath], flatLayer);
                this.setLayerValue(layer, fieldpath, value);
            }
            break;  // Apply only first matching rule
        }
    }
};

/*
* Turns {"Datasource": {"id": "xxx"}} into {"Datasource.id": "xxx"}
*/
C.prototype.flatenLayer = function (layer) {
    var output = {};
    var flaten = function (els, prefix) {
        prefix = prefix && prefix + '.' || "";
        var key;
        for (var el in els) {
            key = prefix + el;
            value = els[el];
            if (value instanceof Object) {
                flaten(value, key);
            }
            else {
                output[key] = value;
            }
        }
    };
    flaten(layer);
    return output;
};

C.prototype.layerHasValue = function (layer, fieldpath, expected) {
    var flatLayer = this.flatenLayer(layer),
        current = flatLayer[fieldpath];
    return expected instanceof Array && expected.indexOf(current) != -1 || current == expected;
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

/*
* From Leaflet.
*/
C.prototype.format = function (str, data) {
    return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
        var value = data[key];
        if (!data.hasOwnProperty(key)) {
            throw new Error('No value provided for variable ' + str);
        }
        return value;
    });
};


C.prototype.output = function () {
    return JSON.stringify(this.mml, null, " ");
};

exports.CartoCC = C;