const express = require('express')
const router= express.Router()
const { ensureAuth} = require('../middlewear/auth')
const story=require('../models/Story')


router.get('/add', ensureAuth, (req,res)=>{
    res.render('stories/add.hbs')
})

router.post('/', ensureAuth, async(req,res)=>{
    try {
        req.body.user=req.user.id
        await story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.send('ERROR 500 UNABLE TO CONNECT TO SERVER')
    }
})

router.get('/', ensureAuth, async (req,res)=>{
    try {
        const stories = await story.find({status: 'public'})
            .populate('user')
            .sort({createdAt:'desc'})
            .lean()

        res.render('stories/index.hbs',{stories})
    } catch (error) {
        console.error(error)
        res.send('ERROR 500 UNABLE TO CONNECT TO SERVER')
    }
})


router.get('/:id', ensureAuth, async(req,res)=>{
    try {
        let stories= await story.findById(req.params.id)
            .populate('user')
            .lean()
        
        if (!stories){
            return res.send("404 ERROR NOT FOUND")
        }
        res.render('stories/show.hbs',{stories})


    } catch (error) {
        console.error(error);
        return res.send("404 PAGE NOT FOUND")
    }

})



router.get('/edit/:id',ensureAuth, async(req, res) => {
    try {
        const stories = await story.findOne({
            _id: req.params.id
        }).lean()
    
        if (! stories){
            return res.send('ERROR 404 NOT FOUND')
        }
        if (stories.user != req.user.id){
            res.redirect('/stories')
        }
        else{
            res.render('stories/edit.hbs',{
                stories,
            })
        }
    } catch (error) {
        console.error(error);
        return res.send("ERROR 500 SERVER REFUSED TO CONNECT")        
    }
})

router.put('/:id', ensureAuth,async (req,res)=>{
    try {
        let stories = await story.findById(req.params.id).lean()

        if (!stories){
            return res.send("ERROR 404 NOT FOUND")
        }
        if (stories.user != req.user.id){
            res.redirect('/stories')
        }
        else{
            stories= await story.findByIdAndUpdate({_id: req.params.id},req.body,{
                new:false,
                runValidators : true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.error(error);
        return res.send("ERROR 500 SERVER COULDNT CONNECT")        
    }
})


router.delete('/:id', ensureAuth,async (req,res)=>{
    try {
        await story.remove({_id:req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        return res.send("ERROR 500 COULDNT CONNECT TO SERVER")
    }

})


router.get('/user/:userId', ensureAuth, async(req,res)=>{
    try {
        const stories= await story.find({
            user: req.params.userId,
            status:'public'
        })
        .populate('user')
        .lean()
        return res.render('stories/index.hbs',{stories})
    } catch (error) {
        console.error(error);
        return res.send("ERROR 500 SERVER REFUSED TO CONNECT")        
    }
})


module.exports=router