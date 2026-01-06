/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_775709040")

  // remove field
  collection.fields.removeById("bool2758837156")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date2037080747",
    "max": "",
    "min": "",
    "name": "lock_time",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_775709040")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2758837156",
    "name": "open",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("date2037080747")

  return app.save(collection)
})
