const Thing = require('../models/thing')
const fs = require('fs')

exports.getAllStuff = (req, res) => {
  Thing.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }))
}

exports.createThing = (req, res) => {
  const thingObject = JSON.parse(req.body.thing)
  delete thingObject._id
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  })
  thing
    .save()
    .then(() => res.status(201).json({ message: 'Objet created !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.getOneThing = (req, res) => {
  Thing.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(404).json({ error }))
}

const modifyThingInMongoDB = (req, res, thingObject) => {
  Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modified !' }))
    .catch((error) => res.status(400).json({ error }))
}

exports.modifyThing = (req, res) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      }
    : { ...req.body }

  if (req.file) {
    Thing.findOne({ _id: req.params.id })
      .then((thing) => {
        const filename = thing.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => modifyThingInMongoDB(req, res, thingObject))
      })
      .catch((error) => res.status(500).json({ error }))
  } else {
    modifyThingInMongoDB(req, res, thingObject)
  }
}

exports.deleteThing = (req, res) => {
  Thing.findOne({ _id: req.params.id }).then((thing) => {
    const filename = thing.imageUrl.split('/images/')[1]
    fs.unlink(`images/${filename}`, () => {
      Thing.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet deleted !' }))
        .catch((error) => res.status(400).json({ error }))
    })
  })
}
