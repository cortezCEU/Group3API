const express =require('express')
const checkoutController = require('../controllers/checkout_controller')

const checkoutRouter = express.Router()
checkoutRouter.post('/create-checkout',checkoutController.createCheckOut) 
checkoutRouter.put('/update-status/:oid',checkoutController.updateStatus) 
checkoutRouter.get('/view-all-order/:uN',checkoutController.viewAllOrder) 
checkoutRouter.put('/cancel-order/:oid',checkoutController.cancelOrder)

module.exports = checkoutRouter