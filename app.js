const cors = require('cors')
const express = require('express')
const app = express()
const { faker } = require('@faker-js/faker');

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

    const page = parseInt(req.query.page) || 1; // Current page number, defaults to 1
    const limit = parseInt(req.query.limit) || 10; // Number of results per page, defaults to 10

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    const totalResults = await CustomerModel.countDocuments().exec(); // Count total number of documents
    results.totalResults = totalResults;

    if (endIndex < totalResults) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    results.customers = await CustomerModel.find().limit(limit).skip(startIndex).exec(); // Find documents with pagination
    res.send(results)
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


app.get('/api/coupon', async (req, res) => {
    let coupons = await CouponModel.find()
    res.send(coupons)
})

app.post('/api/coupon', async (req, res) => {

    const {
        name,
        code,
        minimum_transaction_amount,
        coupon_Type,
        discount_in_percent,
        flat_amount_Of,
        maximum_discout,
        marketing_text,
        terms
    } = req.body

    const existingCoupon = await CouponModel.find({ code: code })

    if (existingCoupon) {
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
        coupon_Type,
        flat_amount_Of,
        maximum_discout,
        marketing_text,
        terms
    })

    let result = await coupon.save()

    res.send(result)
})



app.post('/api/apply_coupon', async (req, res) => {

    let {
        item_id,
        quantity,
        coupon_code,
        customer_id
    } = req.body

    // logic to check if coupon is applicable
    // Also check how much discount is applicable

    let findItem = await ItemModel.findById({_id: item_id})

        let price = findItem.price
        let totalAmount = price * quantity
        

    let coupon = await CouponModel.findOne({code: coupon_code})
    console.log(coupon)

    let minimumTransactionAmount = coupon.minimum_transaction_amount
    let discountInPercent = coupon.discount_in_percent
    let maximumDiscount = coupon.maximum_discout
    let flatAmount = coupon.flat_amount_Of
    

    console.log(maximumDiscount,discountInPercent,flatAmount)
    // let flat_amount_Of = coupon.flat_amount_Of

    // "minimum_transaction_amount" 500,
    // "discount_in_percent": 50,
    // "maximum_discount": 200,
    // "marketing_text": "Get 50% of upto 200",
    
    if(totalAmount < minimumTransactionAmount) {
      return res.send({
            message: "Minimum Transaction Amount should be 500",
        })
    }
      
   let calculatedInPercentDiscount = (discountInPercent * totalAmount) / 100
   

   let finalDiscount = 0


   if (coupon.coupon_Type === "Percentage" && calculatedInPercentDiscount > maximumDiscount) {
        finalDiscount = maximumDiscount
        
   }
   else {
        finalDiscount = calculatedInPercentDiscount
        
   }
      

   if(coupon.coupon_Type === "Flat" && flatAmount > maximumDiscount ) {
      finalDiscount = maximumDiscount
      

   } else {
      finalDiscount = flatAmount
     
   }

    let  finalTotalAmount = totalAmount - finalDiscount

   
    return res.send({
        message: "Coupon Applied Successfully",
        amount_off: finalDiscount,
        amount_to_pay: finalTotalAmount 
    })
})

module.exports = app;