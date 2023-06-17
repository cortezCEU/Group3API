const express = require('express')
const prodController = require('../controllers/product_controller')

const prodRouter = express.Router()

prodRouter.post('/add-product', prodController.addProduct)
prodRouter.get('/viewproductbyname',prodController.viewProductbyname)
prodRouter.get('/viewproductbycolor',prodController.viewProductbycolor)
prodRouter.get('/viewproductbysize',prodController.viewProductbysize)
prodRouter.get('/viewproductbybrand',prodController.viewProductbybrand)
prodRouter.put('/updateproductname/:id',prodController.updateProductName)
prodRouter.put('/updateproductsize/:id',prodController.updateProductSize)
prodRouter.put('/updateproductcolor/:id',prodController.updateProductColor)
prodRouter.put('/updateproductdesc/:id',prodController.updateProductDesc)
prodRouter.delete('/deleteproduct/:id',prodController.deleteProduct)

module.exports = prodRouter