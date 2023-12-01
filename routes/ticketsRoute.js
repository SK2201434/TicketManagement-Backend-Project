const ticket = require('../controllers/ticketcontroller')
const express = require('express')
// const  upload  = require('../middleware/multer')
const router = express.Router()
const { isUser, isAdmin, isClient } = require('../middleware/authorization')

router.post('/addticket/:pid/:userRole?', ticket.addTicket)
router.get('/getallticket',isAdmin, ticket.getTickets)
router.get('/getassignedtickettoprject/:projectId', ticket.getTicketAssignedProjects)
router.get('/getticketstatus', ticket.getTicketsByStatus)
router.patch('/updateticketstatus/:_id/:userRole?', isAdmin,isUser, ticket.updateTicketStatus);
router.patch('/updateticket/:_id/:userRole?', isAdmin,isUser, ticket.editTicket)
router.delete('/delteticket/:_id/:userRole?', isAdmin, ticket.deleteTicket)

module.exports = router
