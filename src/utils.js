const neo4j = require('neo4j-driver').v1
const fetch = require('node-fetch')

function inArray(element,arr) {
    return arr.indexOf(element) !== -1
}

async function query(query) {
    const url = inArray('--docker', process.argv) 
        ? "bolt://neo4j" 
        : "bolt://localhost"
    const driver = neo4j.driver(url, neo4j.auth.basic("neo4j", "123456"))
    const session = driver.session()

    return await session.run(query)
}

async function getLatLon(postcode) {
    const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    const json = await res.json()
    // console.log(postcode)
    // console.log(json)
    return {
        lat: json.result.latitude,
        lon: json.result.longitude
    }
}

function getReturn(obj) {
    return obj.records[0]._fields[0].low
}

module.exports = {query, getLatLon, getReturn} 

