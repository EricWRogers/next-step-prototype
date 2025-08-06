/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1687431684")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" &&\n@collection.groups.id ?= group &&\n@collection.groups.members.id ?= @request.auth.id\n\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1687431684")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && @collection.groups.members ~ @request.auth.id"
  }, collection)

  return app.save(collection)
})
