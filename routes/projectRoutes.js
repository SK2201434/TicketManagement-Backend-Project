const express = require('express')
const router = express.Router()
const project = require('../controllers/projectController')
const  upload  = require('../middleware/multer')
const { isUser, isAdmin, isClient } = require('../middleware/authorization')

// all route's are controlled by admin only
router.post('/addproject/:userRole?',upload.single('project_image') , isClient, project.addProject)
router.get('/allprojects/:userRole?',isAdmin, project.getProjects)
router.get('/projectsvianame/:project_name/:userRole?',isAdmin, project.getProjectsbyName)
router.get('/projectsviaid/:_id/:userRole?',isAdmin, project.getProjectsbyId)
router.patch('/updateproject/:_id/:userRole?', isAdmin, project.updateProject)
router.delete('/deleteproject/:_id/:userRole?',isAdmin, project.deleteProject)




module.exports = router; 