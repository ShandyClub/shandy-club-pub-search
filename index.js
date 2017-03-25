const { json } = require('micro')
const { MongoClient } = require('mongodb')

module.exports = async (req, res) => {

  // connect to database
  const db = await MongoClient.connect(process.env.MONGO_URL, { promiseLibrary: global.Promise })

  // parse request body
  const { point, features, maxDistance } = await json(req)

  // query by selected features
  const query = features && Object.keys(features).reduce( (reduced, f) => features[f] ? Object.assign({}, reduced, { [`features.${f}`]: features[f] }) : reduced, {} ) || {}

  // and location
  query['loc'] = { $near: { $geometry: { type: 'Point', coordinates: point }, $maxDistance: maxDistance } }

  // execute database query
  const pubs = await db.collection('pubs').find(query).toArray()

  // return response body
  return pubs

}
