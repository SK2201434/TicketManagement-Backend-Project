const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"Project"
    
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    
    },
    ticket_name: {
        type: String,
        // required: [true,"Please Enter Task Name "],
    },
    ticket_description: {
        type: String,
        required: [true,"Please Enter Task Description "],
    },
   
    ticket_status: {
        type: String,
        require: true,
        
    },
       
    ticket_priority: {
        type: String,
       
    },
    isActive: {
        type: Boolean,
        default: true
    }

})
ticketSchema.set('timestamps', true)
module.exports = mongoose.model('Ticket', ticketSchema)