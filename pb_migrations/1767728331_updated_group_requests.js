/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1432285113")

  // update collection data
  unmarshal({
    "createRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1432285113")

  // update collection data
  unmarshal({
    "createRule": "@collection.groups.admin ?= @request.auth.id"
  }, collection)

  return app.save(collection)
})
