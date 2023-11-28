const express = require('express')
const router =express.Router()
const reviewDemo=require('../controllers/reviewController')
const { isUser, isAdmin, isClient } = require('../middleware/authorization')

router.post('/addReview/:pid/:tid/:userRole?',isClient,reviewDemo.addReviewDemo)
router.get('/showallreview',reviewDemo.showAllReview)
router.patch('/updatereview/:id/:userRole?',isClient,reviewDemo.updateReviewById)
router.delete('/deletereview/:id/:userRole?',isClient,reviewDemo.deleteReviewById)

module.exports = router