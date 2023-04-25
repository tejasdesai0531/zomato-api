const cors = require('cors')
const express = require('express')
const app = express()
const {faker} = require('@faker-js/faker');

const ItemModel = require('./models/item.model')
const CouponModel = require('./models/coupons.model')
const CustomerModel = require('./models/customers.model')

app.use(cors())
app.use(express.json())

// item routes

app.get('/api/item', async (req, res) => {
    const items = await ItemModel.find()
    res.send(items)
})
app.get('/api/item/:id', async (req, res) => {
    let id = req.params.id
    const item = await ItemModel.findById(id)
    res.send(item)
})
app.post('/api/item', async (req, res) => {
    const { name, price } = req.body

    const item = new ItemModel({ name, price })
    await item.save()

    res.send(item)

})


// customer routes

app.get('/api/customer', async (req, res) => {
    let customers = await CustomerModel.find()
    res.send(customers)
})

app.get('/api/customer/:id', async (req, res) => {
    let id = req.params.id
    let customer = await CustomerModel.findById(id)
    res.send(customer)
})

app.post('/api/customer', async (req, res) => {

    let customers = []

    // for (let i = 0; i < 100; i++) {

    //     const first_name = faker.name.firstName();
    //     const last_name = faker.name.lastName();
    //     const email = faker.internet.email(first_name, last_name);
        
    //     customers.push({first_name, last_name, email})
    // }

    let result = await CustomerModel.insertMany(customers)

    res.send(result)
})



// coupons apis

app.post('/api/coupon', async (req, res) => {
    
    const {
        name,
        code,
        minimum_transaction_amount,
        discount_in_percent,
        maximum_discout,
        marketing_text,
        terms
    } = req.body

    const existingCoupon = await CouponModel.findOne({code: code})

    if(existingCoupon) {
        return res.send({
            error: true,
            message: "Coupon code already exists"
        })
    }

    let coupon = new CouponModel({
        name,
        code,
        minimum_transaction_amount,
        discount_in_percent,
        maximum_discout,
        marketing_text,
        terms
    })

    let result = await coupon.save()

    res.send(result)
})


module.exports = app;