/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1432285113")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = user || @collection.groups.admin ~ @request.auth.id",
    "deleteRule": "@request.auth.id = user || @collection.groups.admin ~ @request.auth.id",
    "listRule": "@request.auth.id = user || @collection.groups.admin ~ @request.auth.id",
    "updateRule": "@request.auth.id = user || @collection.groups.admin ~ @request.auth.id",
    "viewRule": "@request.auth.id = user || @collection.groups.admin ~ @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1432285113")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "@request.auth.id = user || @collection.groups.admin ?= @request.auth.id",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
