const express = require('express')
const router= express.Router()
const { ensureAuth, ensureGuest} = require('../middlewear/auth')
const story=require('../models/Story')


router.get('/', ensureGuest, (req,res)=>{
    res.render('login.hbs',{
        layout:'login'
    })
})

router.get('/dashboard', ensureAuth ,async(req,res)=>{
    try {
        const stories = await story.find({user: req.user.id}).lean()
        res.render('dashboard.hbs',{
            name: req.user.firstName,
            stories
        })
    } 
    catch (error) {
        console.error(err)
        res.send('ERROR 500 INTERNAL SERVER ERROR')
    }
})

module.exports=router