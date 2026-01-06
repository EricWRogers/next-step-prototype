/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_775709040")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2584083068",
    "hidden": false,
    "id": "relation3742258750",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "challenge_instance",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation2375276105",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json2918445923",
    "maxSize": 0,
    "name": "data",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

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

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date186019193",
    "max": "",
    "min": "",
    "name": "completed_time",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_775709040")

  // remove field
  collection.fields.removeById("relation3742258750")

  // remove field
  collection.fields.removeById("relation2375276105")

  // remove field
  collection.fields.removeById("json2918445923")

  // remove field
  collection.fields.removeById("bool2758837156")

  // remove field
  collection.fields.removeById("date186019193")

  return app.save(collection)
})
