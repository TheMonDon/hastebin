const assert = require('assert')
const getStdin = require('get-stdin')
const got = require('got')
const jsapi = require('../src/hastebin')

const testData = 'test'

function assertHastebinUrlMatchesTestData (input) {
  const hastebinUrl = input.trim()
  assert(hastebinUrl.match(/^https:\/\/hastebin.com\/.*/) != null, 'output must be a hastebin url')
  const key = hastebinUrl.split('/').slice(-1)[0]
  return got('https://hastebin.com/raw/' + key)

    .then(function (result) {
      assert.equal(result.body.trim(), testData, 'hastebin contents must equal test data')
    })
}

console.log('testing stdin...')
getStdin().then(assertHastebinUrlMatchesTestData).then(function () {
  console.log('testing jsapi non-raw...')
  jsapi.createPaste(testData).then(assertHastebinUrlMatchesTestData)
    .then(function () {
      console.log('testing jsapi raw...')
      jsapi.createPaste(testData, { raw: true }).then(assertHastebinUrlMatchesTestData)
    })
})
