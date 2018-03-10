const express = require('express')
const bodyParser = require('body-parser')
const { query, getLatLon , getReturn} = require('./utils')

const app = express()
const PORT = 3000

app.listen(PORT, () =>  {
    console.log(`App listening on port ${PORT}`)
})

app.use((req, res, next) => {
    res.set('content-type', 'application/json')
    next()
})
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello')
})

app.post('/user', async (req, res) => {
    const { name, phone, initials } = req.body
    if(name == null || phone == null || initials == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing name, initials or phone"
        }))
        return
    }
    try {
        const result = await query(`CREATE (n:USER {
            name: "${name}",
            phone: "${phone}",
            initials: "${initials}"
        }) RETURN ID(n)`)
        res.send(JSON.stringify({
            msg: `User ${name}(${initials}) has been created`,
            userId: getReturn(result)
        }))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: e.message
        }))
    }
})

app.post('/friend', async(req, res) => {
    const { phoneA, phoneB } = req.body
    if(phoneA == null || phoneB == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing one or both phones"
        }))
        return
    }
    try {
        const result = await query(`MATCH (a:USER), (b:USER)
        WHERE
        a.phone = "${phoneA}" AND
        b.phone = "${phoneB}"
        CREATE (a)-[r:FRIENDS_WITH]->(b)
        RETURN r`)
        res.send(JSON.stringify({
            msg: `Friendship created between ${phoneA} and ${phoneB}`
        }))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            e: e.message
        }))
    }
})

app.post('/group', async (req, res) => {
    const { createdBy, postcode } = req.body
    if(createdBy == null || postcode == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing createdBy or postcode"
        }))
        return
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
        res.statusCode = 400
        res.send(JSON.stringify({
            e: e.message
        }))
    }
})

app.post('/group/request', async (req, res) => {
    const { groupId, userId } = req.body
    if(groupId == null || userId == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing groupid or userId"
        }))
        return
    }
    try {
        const {lat, lon} = await getLatLon(postcode)
        const result = await query(`MATCH (p:USER), (g:GROUP)
        WHERE p.id = ${createdBy} AND
        g.id = ${groupId}
        CREATE (g)-[r:JOIN_REQUEST]->(p)
        RETURN g,p`)
        res.send(JSON.stringify({
            msg: `Request sent to id ${fbId}`
        }))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            e: e.message
        }))
    }

})

// View 
app.get('/group/request', async(req, res) => {
})


