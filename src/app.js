const express = require('express')
const bodyParser = require('body-parser')
const { query, getLatLon } = require('./utils')

const app = express()
const PORT = 3000

app.listen(PORT, () =>  {
    console.log(`App listening on port ${PORT}`)
})

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello')
})

app.post('/user', async (req, res) => {
    const { name, photo, fbId } = req.body
    if(name == null || photo == null || fbId == null) {
        res.set(400)
        res.send(JSON.stringify({
            error: "Missing name, photo or fbid"
        }))
    }
    try {
        const result = await query(`CREATE (n:USER {
            name: "${name}",
            photo: "${photo}",
            fbId: "${fbId}"
        }) RETURN n`)
        res.send(JSON.stringify({
            msg: `User ${name} has been created`
        }))
    } catch(e) {
        res.set(400)
        res.send(JSON.stringify({
            error: e.message
        }))
    }
})

app.post('/group', async (req, res) => {
    const { createdBy, postcode } = req.body
    if(createdBy == null || postcode == null) {
        res.set(400)
        res.send(JSON.stringify({
            error: "Missing createdBy or postcode"
        }))
    }
    try {
        const {lat, lon} = await getLatLon(postcode)
        const result = await query(`MATCH (p:USER)
        WHERE p.fbId = "${createdBy}"
        CREATE (n:GROUP {
            date: "${Date.now()}",
            createdBy: "${createdBy}"
        })<-[r:IN {
            lat: ${lat},
            lon: ${lon}
        }]-(p)
        RETURN n`)
        res.send(JSON.stringify({
            msg: `Group created`
        }))
    } catch(e) {
        res.set(400)
        res.send(JSON.stringify({
            e: e.message
        }))
    }
})

app.post('/group/request', async (req, res) => {
    const { groupId, fbId } = req.body
    if(groupId == null || fbId == null) {
        res.set(400)
        res.send(JSON.stringify({
            error: "Missing groupid or fbId"
        }))
    }
    try {
        const {lat, lon} = await getLatLon(postcode)
        const result = await query(`MATCH (p:USER), (g:GROUP)
        WHERE p.fbId = "${createdBy}" AND
        g.id = "${groupId}"
        CREATE (g)-[r:JOIN_REQUEST]->(p)
        RETURN g,p`)
        res.send(JSON.stringify({
            msg: `Request sent to id ${fbId}`
        }))
    } catch(e) {
        res.set(400)
        res.send(JSON.stringify({
            e: e.message
        }))
    }

})


