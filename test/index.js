const fsp = require('fs-promise')
const listen = require('test-listen')
const micro = require('micro')
const path = require('path')
const request = require('request-promise')
const test = require('ava')

test('shandy-club-pub-search', async t => {

  // mock `micro` service
  const service = micro(async (req, res) => {

    const pubs = await fsp.readFile(path.join(__dirname, 'fixtures', 'pubs.json'))

    return JSON.parse(pubs)

  })

  // generate ephemeral URL from mocked `micro` service
  const url = await listen(service)

  // mock HTTP request
  const body = await request({
    method: 'POST',
    uri: url,
    body: { "point": [ -0.11573810000000001, 51.5734121 ], "maxDistance": 1600 },
    json: true,
  })

  t.deepEqual(body[0].name, 'Nicholas Nickleby')

})
