const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/items', async (req, res) => {

    
})

module.exports = app;