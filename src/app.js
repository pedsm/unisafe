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
    res.send('Night Owls')
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
    const { phone, postcode } = req.body
    if(phone == null || postcode == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing phone or postcode"
        }))
        return
    }
    try {
        const {lat, lon} = await getLatLon(postcode)
        const result = await query(`MATCH (p:USER)
        WHERE p.phone = "${phone}"
        CREATE (n:GROUP {
            date: "${Date.now()}",
            createdBy: "${phone}"
        })<-[r:IN {
            lat: ${lat},
            lon: ${lon}
        }]-(p)
        RETURN ID(n)`)
        res.send(JSON.stringify({
            msg: `Group created for ${phone}`,
            groupId: getReturn(result)
        }))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            e: e.message
        }))
    }
})

app.post('/group/request', async (req, res) => {
    const { groupId, phone } = req.body
    if(groupId == null || phone == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing groupid or phone"
        }))
        return
    }
    try {
        const result = await query(`MATCH (p:USER), (g:GROUP)
        WHERE p.phone = "${phone}" AND
        ID(g) = ${groupId}
        CREATE (g)-[r:JOIN_REQUEST]->(p)
        RETURN g,p`)
        res.send(JSON.stringify({
            msg: `Request from ${groupId} sent to phone ${phone}`
        }))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            e: e.message
        }))
    }

})

app.post('/group/accept', async (req, res) => {
    const { phone, groupId, postcode } = req.body
    console.log(groupId, phone)
    if(groupId == null || phone == null || postcode == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: "Missing phone, postcode or groupid"
        }))
        return
    }
    try {
        let result = await query(`MATCH (p:USER)-[r:JOIN_REQUEST]-(g:GROUP)
        WHERE p.phone = "${phone}" AND
        ID(g) = ${groupId}
        DELETE r 
        RETURN g`)
        const {lat, lon} = await getLatLon(postcode)
        result = await query(`MATCH (p:USER), (g:GROUP)
        WHERE p.phone = "${phone}" AND
        ID(g) = ${groupId}
        CREATE (g)<-[r:IN {
            lat: ${lat},
            lon: ${lon}
        }]-(p)
        RETURN ID(g)`)
        res.send(JSON.stringify({
            msg: `Accepted request from group ${getReturn(result)}`
        }))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            e: e.message
        }))
    }
})

// GET requests
app.get('/friends/:me', async (req, res) => {
    const { me } = req.params
    if(me == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: 'Phone number was not provided'
        }))
        return
    }

    try {
        const result = await query(`
    MATCH (n:USER)-[r:FRIENDS_WITH]-(f:USER)
    WHERE n.phone = "${me}"
    RETURN f
    `)
        res.send(result.records.map(a => a._fields[0].properties))
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: e.message
        }))
    }
})

app.get('/friend/:them', async (req, res) => {
    const { them } = req.params
    if(them == null) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: 'Phone number was not provided'
        }))
        return
    }

    try {
        const result = await query(`
        MATCH (n:USER)
        WHERE n.phone = "${them}"
        RETURN n
    `)
        if(result.records.length == 0) {
            res.statusCode = 400
            res.send(JSON.stringify({
                error: `No person with ${them} phone number`
            }))
            return
        }
        res.send(result.records[0]._fields[0].properties)
    } catch(e) {
        res.statusCode = 400
        res.send(JSON.stringify({
            error: e.message
        }))
    }
    
})
