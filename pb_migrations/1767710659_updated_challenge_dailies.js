/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_590556847")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3937350482",
    "hidden": false,
    "id": "relation1391816262",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "challenge_week",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_590556847")

  // remove field
  collection.fields.removeById("relation1391816262")

  return app.save(collection)
})
