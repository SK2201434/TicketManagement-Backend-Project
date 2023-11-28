const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"Project"
    
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    
    },
    task_name: {
        type: String,
        // required: [true,"Please Enter Task Name "],
    },
    task_description: {
        type: String,
        // required: [true,"Please Enter Task Description "],
    },
    // task_image: {
    //     type: String,
    //     required: [true,"Please add task Image "],
    // },
    task_status: {
        type: String,
        require: true,
        // required: [true,"Please Enter Task Description "],
    },
       
    task_priority: {
        type: String,
       
    },
    isActive: {
        type: Boolean,
        default: true
    }

})
taskSchema.set('timestamps', true)
module.exports = mongoose.model('task', taskSchema)