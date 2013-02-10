# CartoCC — Carto Config Customizer

Very simple tool for customizing layers values of a `.mml` config file.

Warning: it's *experimental* and *work in progress*.

### Install

```
npm intall cartocc
```

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
            "Datasource.type": "shape"
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
cartocc <path-to-project.mml> <path-to-custom-rules.json> > local_project.mml
```

### Collaborative workflow suggestion

When using TileMill in a collaborative workflow, the commits involving the `.mml file` can be polluted by changes related to local configuration. To avoid this, here is a suggested workflow.

**Important limitation to notice**: it will not be possible to use TileMill itself for managing the `.mml` file.

1. Use as `.mml` a `<project-name>.mml` file; only this one must be versionned (TileMill defaults to `<project-name>.mml` in case `project.mml` is missing)
2. Use a file `cartocc.json` located in your project root to store the rules.
3. Use the following command to process the configuration: `cartocc <project-name>`; this will generate a `project.mml` file in the project root, which will be used by TileMill; this file must not be committed.
