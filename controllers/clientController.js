const express = require('express')
const clientSchema = require('../models/clientSchema')
const ProjectSchema = require("../models/projectSchema");
// const uploads = require('../middleware/multer')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const  transporter  = require('../services/emailService');
const taskSchema = require('../models/taskSchema');
const { userInfo } = require('os');
const userSchema = require('../models/userSchema');
const projectSchema = require('../models/projectSchema');
const { log } = require('console');
const bcrypt = require("bcrypt");



// add Task api
const addClient = async (req, res) => {
    const clientData = new clientSchema(req.body);
    try {
        const isClientExists = await clientSchema.findOne({
            clientEmail: req.body.clientEmail,
          });
        if (isClientExists) {
            res.status(404).json({
                success: false,
                message: "Client  is already existed with this email ! try again with another email"

            })
        } else {

              const signuplink = `http://localhost:8000/user/signup`
              const clientName = req.body.clientName
              await transporter.sendMail({
                  from: process.env.Email,
                  to: req.body.clientEmail,
                  subject: "Signup Request from IONINKS",
                  html: `<p> Dear ${clientName} you have been onboarded to Ioninks portal please make sure to Signup using the below link</p> 
                  <a href="${signuplink}">Click on the link to Signup to IONINKS</a>`,
              })
              await clientData.save();
              res.status(201).json({
                  success: true,
                  message: "Client Added Successfully and mail sended to client",
                  Task: clientData,
              })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error occur ${error.stack}`,
        });
    }
};

// see  all clients
const getAllClients = async (req, res) => {
    try {
        const allClientList = await clientSchema.find()
        if (allClientList != null) {
            return res.status(200).json({
                sucess: true,
                message: "your all Client list below",
                ClinetList: allClientList
            })

        } else {
            res.status(404).json({
                success: false,
                message: "No Client Found"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error occurs${error.message}`
        })
    }
}
// get client by id 
const getClientbyId = async (req, res) => {
  try {
    const { _id } = req.params;
    const client = await clientSchema.findById({ _id })
    if (client ) {
      res.status(200).json({
        success: true,
        message: "Client Details listed below ",
        ClientDetails: client,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no Clinet found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// =====================================================
// update client details
const updateClientDetails = async (req, res) => {
  try {
    const { _id } = req.params;
    const updateCDetails = await clientSchema.findByIdAndUpdate({ _id },req.body);
    if (updateCDetails != null) {
      await updateCDetails.save();
      return res.status(200).json({
        success: true,
        message: "Client details updated successfully",
        updatedDetaisl:updateCDetails
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no such Client",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ====================================================
// delete clinet 
const deleteClient = async (req, res) => {
  const { _id } = req.params;
  const deteleClient = await clientSchema.findByIdAndDelete(
    { _id },
    req.body
  );
  try {
    if (deteleClient != null) {
      res.status(200).json({
        success: true,
        message: "your Project deleted succrssfully",
        deletedClient:deteleClient
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Project not deleted try again",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ======================================================

const getClientProjects = async (req, res) => {
    const clientEmail = req.params.emailId;
  
    try {
    
      const allProject = await ProjectSchema.find({ clientEmail }).populate("project_tasks");
      for (let i = 0; i < allProject.length; i++) {
        const allTasks = await taskSchema.find({projectId:allProject[i]._id});  
        Array.prototype.push.apply(allProject[i].project_tasks, allTasks);  
      }
  
      if (allProject) {
        res.status(200).json({
          success: true,
          message: "Client projects",
          assignedProjects: allProject,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No projects found for client",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  // ------------------------------
  const getClientProjectsByClientId = async (req,res) =>{

    const clientId = req.params._id
    console.log(clientId);

    try {
      const allProjects = await projectSchema.find({clientId})
      if (allProjects) {
        res.status(200).json({
          success: true,
          message: "Client projects",
          assignedProjects: allProjects,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No projects found for client",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }



  
module.exports = { 
  addClient,
  getAllClients,
  getClientbyId,
  updateClientDetails,
  deleteClient,
  getClientProjects,
  getClientProjectsByClientId}

