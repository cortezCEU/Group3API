const express =require('express')
const userController = require('../controllers/user_controller')

const userRouter = express.Router()
userRouter.post('/signup-user',userController.createUser) // CREATE USER ACCOUNT
userRouter.get('/login-user',userController.loginUser) // LOGIN USER
userRouter.delete('/delete/:username',userController.deleteUser)
userRouter.put('/update/:username',userController.updateUser)

module.exports = userRouter