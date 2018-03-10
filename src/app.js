const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000

app.listen(PORT, () =>  {
    console.log(`App listening on port ${PORT}`)
})

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('hello')
})

