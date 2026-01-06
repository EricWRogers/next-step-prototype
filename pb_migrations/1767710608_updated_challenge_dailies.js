/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_590556847")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1967931504",
    "hidden": false,
    "id": "relation3763030865",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "main_quest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1967931504",
    "hidden": false,
    "id": "relation2560515380",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "quests",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_590556847")

  // remove field
  collection.fields.removeById("relation3763030865")

  // remove field
  collection.fields.removeById("relation2560515380")

  return app.save(collection)
})
