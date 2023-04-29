require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')
const port = process.env.PORT || 3000


mongoose.connect(process.env.DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.log(err)
  })


