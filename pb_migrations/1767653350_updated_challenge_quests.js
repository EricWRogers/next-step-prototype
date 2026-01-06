/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1967931504")

  // remove field
  collection.fields.removeById("json3763030865")

  return app.save(collection)
})
