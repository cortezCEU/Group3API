const express = require('express')
const addcartController = require('../controllers/addcart_controller')

const addtocartRouter = express.Router()

addtocartRouter.post ('/add-cart', addcartController.addtocartProduct)
addtocartRouter.get ('/view-cart/:username', addcartController.addtocart_viewProductbyUsername)
addtocartRouter.put ('/update-cart/:cid', addcartController.updateCart)
addtocartRouter.delete ('/delete-cart/:cid', addcartController.deleteCart)

module.exports = addtocartRouter