const neo4j = require('neo4j-driver').v1
const fetch = require('node-fetch')

async function query(query) {
    const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123456"))
    const session = driver.session()

    return await session.run(query)
}

async function getLatLon(postcode) {
    const res = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    const json = await res.json()
    console.log(postcode)
    console.log(json)
    return {
        lat: json.result.latitude,
        lon: json.result.longitude
    }
}

module.exports = {query, getLatLon} 

