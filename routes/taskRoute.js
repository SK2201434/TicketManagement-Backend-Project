const task = require('../controllers/taskControllers')
const express = require('express')
// const  upload  = require('../middleware/multer')
const router = express.Router()
const { isUser, isAdmin, isClient } = require('../middleware/authorization')

router.post('/addtask/:pid/:userRole?',isAdmin, task.addTask)
router.get('/getalltask', task.getTasks)
router.get('/getassignedtasktoprject/:projectId', task.getTaskAssignedProjects)
router.get('/gettaskstatus', task.getTaskByStatus)
router.patch('/updatetaskstatus/:_id/:userRole?', isAdmin, task.updateTaskStatus);
router.patch('/updatetask/:_id/:userRole?', isAdmin, task.editTask)
router.delete('/deltetask/:_id/:userRole?', isAdmin, task.deleteTask)

module.exports = router
