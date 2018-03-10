const neo4j = require('neo4j-driver').v1

async function query(query) {
    const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "123456"))
    const session = driver.session()

    return await session.run(query)
}

module.exports = {query}
