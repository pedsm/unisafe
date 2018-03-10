const express = require('express')
const bodyParser = require('body-parser')
const query = require('./utils').query

const app = express()
const PORT = 3000

app.listen(PORT, () =>  {
    console.log(`App listening on port ${PORT}`)
})

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello')
})

/**
 * Request body
 * {
 *   "name": "",
 *   "photo": "",
 *   "fbId": ""
 * } 
 */
app.post('/user', async (req, res) => {
    const { name, photo, fbId } = req.body
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

/**
 * Request body
 * {
 *   "createdBy": "",
 * } 
 */
app.post('/group', async (req, res) => {
    const { createdBy } = req.body
    try {
        const result = await query(`MATCH (p:USER)
        WHERE p.fbId = "${createdBy}"
        CREATE (n:GROUP {
            date: "${Date.now()}"
        })<-[r:IN]-(p)
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



