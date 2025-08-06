/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1687431684")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" &&\n@collection.groups.id ?= group &&\n@collection.groups.admin ?= @request.auth.id",
    "listRule": "@request.auth.id != \"\" &&\n@collection.groups.id ?= group &&\n@collection.groups.members.id ?= @request.auth.id",
    "viewRule": "@request.auth.id != \"\" &&\n@collection.groups.id ?= group &&\n@collection.groups.members.id ?= @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1687431684")

  // update collection data
  unmarshal({
    "createRule": null,
    "listRule": "@request.auth.id != \"\" &&\n@collection.groups.id ?= group &&\n@collection.groups.members.id ?= @request.auth.id\n\n",
    "viewRule": "@request.auth.id != \"\" && @collection.groups.members ~ @request.auth.id"
  }, collection)

  return app.save(collection)
})
