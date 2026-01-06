/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1967931504")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1967931504",
    "hidden": false,
    "id": "relation780230353",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "blocker",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1967931504")

  // remove field
  collection.fields.removeById("relation780230353")

  return app.save(collection)
})
