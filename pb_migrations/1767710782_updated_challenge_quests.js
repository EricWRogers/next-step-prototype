/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1967931504")

  // remove field
  collection.fields.removeById("json3763030865")

  // remove field
  collection.fields.removeById("json1156624666")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number666537513",
    "max": null,
    "min": null,
    "name": "points",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1843675174",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1967931504")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json3763030865",
    "maxSize": 0,
    "name": "main_quest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json1156624666",
    "maxSize": 0,
    "name": "side_quests",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("number666537513")

  // remove field
  collection.fields.removeById("text1843675174")

  return app.save(collection)
})
