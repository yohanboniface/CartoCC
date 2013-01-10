# CartoCC — Carto Config Customizer

Very simple tool for customizing layers values of a `.mml` config file.

Warning: it's *experimental* and *work in progress*.

### Usage

For example, you may want to customize the database connection or some shp file path.

CartoCC makes it very simple. You just create some rules, stored in a json file, applying to layers fields. Each rule define some values to set to a layer if some field has some value.

Example of rules:

```
[
    {
        "if": {
            "Datasource.type": "postgis"
        },
        "then": {
            "Datasource.dbname": "osm2",
            "Datasource.host": "localhost2",
            "Datasource.password": "blahblah"
        }
    },
    {
        "if": {
            "class": "shp"
        },
        "then": {
            "Datasource.file": "/data/{id}.shp"
        }
    }
]
```

You can also have multiple conditions (which are ANDed):
```
[
    {
        "if": {
            "geometry": "multipolygon",
            "class": "bigdata"
        },
        "then": {
            "Datasource.dbname": "anotherdb",
            "Datasource.host": "hostforbigqueries",
            "Datasource.password": "123456"
        }
    }
]
```

You can also test on an array of values (which are ORed):
```
[
    {
        "if": {
            "id": ["id1", "id2"]
        },
        "then": {
            "Datasource.dbname": "anotherdb",
            "Datasource.host": "anotherhost",
            "Datasource.password": "123456"
        }
    }
]
```

You can use dynamic properties of the layer in the final value (this will use Layer.id in the final path):
```
[
    {
        "if": {
            "class": "shp"
        },
        "then": {
            "Datasource.file": "/data/{id}/{id}.shp"
        }
    }
]
```

**Notes**:
* *Fields are relative to `Layer`. You can use a path as field reference.
For example, `Datasource.type` will look for the field `type` of `Layer.Datasource`*.
* *only first matching rule apply*


Then run the script from command line to get the customized `.mml` file:

```
node cartocc.js <path-to-project.mml> <path-to-custom-rules.json> > local_project.mml
```
