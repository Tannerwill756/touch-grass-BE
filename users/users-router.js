const express = require('express')
const router = express.Router()
const Users = require('../models/users')

// Getting All
router.get('/', async (req,res) => {
    try{
        const users = await Users.find()
        res.json(users)
    } catch(err){
        res.status(500).json({message: err.message})
    }
})
// Get User by Id
router.get('/:id', async (req,res) => {
    try{
        const users = await Users.find()
        res.json(users)
    } catch(err){
        res.status(500).json({message: err.message})
    }
})

// Create User
router.post('/', async (req,res) => {
    const user = new Users({
        username: req.body.username,
        address: req.body.address,
        password: req.body.password
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})


module.exports = router