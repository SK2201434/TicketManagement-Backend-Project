const express = require('express')
const taskSchema = require('../models/taskSchema')
const ProjectSchema = require("../models/projectSchema");
const uploads = require('../middleware/multer')
const fs = require('fs')

// add Task api
const addTask = async (req, res) => {
    try {
         
        const taskData = new taskSchema(req.body);
        if (taskData != null) {
            // taskData.task_image = `/uploads/${(req.file.filename)}`;
            taskData.userId = req.userId;
            taskData.projectId = req.params.pid;

            await taskData.save();
            res.status(200).json({
                success: true,
                message: "Task Added Successfully",
                Task: taskData,
            })
        } else {
            fs.unlinkSync(req.file.path)
            res.status(404).json({
                success: false,
                message: "no Task added try again "

            })
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Error occur ${error.stack}`,
        });
    }
};

// see  all Tasks
const getTasks = async (req, res) => {
    try {
        const allTaskList = await taskSchema.find()
        if (allTaskList != null) {
            return res.status(200).json({
                sucess: true,
                message: "your all Task list below",
                TaskList: allTaskList
            })

        } else {
            res.status(404).json({
                success: false,
                message: "No Task Found"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error occurs${error.message}`
        })
    }
}

// ==================================

const getTaskAssignedProjects = async (req, res) => {
    try {
      const projectIdd = req.params.projectId; 
       const tasks= await taskSchema.find({projectId:projectIdd});
     
      if (tasks) {
        res.status(200).json({
          success: true,
          message: "Assigned task for the user",
          assignedTasks: tasks,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  
// Get tasks by status
const getTaskByStatus = async (req, res) => {
    try {
        const { status } = req.query; // Assuming you'll pass the status as a query parameter

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status parameter is required",
            });
        }

        const tasks = await taskSchema.find({ task_status: status });

        if (tasks.length > 0) {
            return res.status(200).json({
                success: true,
                message: `Tasks with status '${status}'`,
                tasks,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `No tasks found with status '${status}'`,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// ================================
const updateTaskStatus = async (req, res) => {
    try {
        const { _id } = req.params;
        const { task_status } = req.body; // Assuming you send the new status in the request body

        const updatedTask = await taskSchema.findByIdAndUpdate(_id,
            { task_status },
            { new: true } // To get the updated document after the update
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            updatedTask,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// ===========================  

// edit Task 
const editTask = async (req, res) => {
    try {
        const { _id } = req.params
        const taskedit = await taskSchema.findByIdAndUpdate({ _id }, req.body)
        if (taskedit != null) {
            await taskedit.save()
            res.status(200).json({
                success: true,
                message: "Task updated successfull ",
                Taskedit: taskedit
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Task not  updated try again !! "
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

// delete reveiw 
const deleteTask = async (req, res) => {
    try {
        const { _id } = req.params
        const taskdeleted = await taskSchema.findByIdAndDelete({ _id }, req.body)
        if (taskdeleted != null) {
            res.status(200).json({
                success: true,
                message: "Task deleted successfully",
                show:taskdeleted
            })
        } else {
            res.status(404).json({
                success: false,
                message: "No Task deleted try again"
            })

        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
module.exports = { addTask, 
     getTasks, 
     editTask,
     deleteTask,
     getTaskAssignedProjects,
     getTaskByStatus,
     updateTaskStatus }


