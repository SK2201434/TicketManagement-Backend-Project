const express = require("express");
const userSchema = require("../models/userSchema");
const ProjectSchema = require("../models/projectSchema");
const fs = require("fs");
const uploads = require("../middleware/multer");
const taskSchema = require("../models/taskSchema");

// FOR admin ALL API'S
// add Project api
const addProject = async (req, res) => {
  try {
    const projectData = new ProjectSchema(req.body);
    // console.log(projectData);
    if (projectData != null) {
      // projectData.project_image = `/uploads/${req.file.filename}`;
      await projectData.save();
      res.status(200).json({
        success: true,
        message: "Project added successfully",
        Project: projectData,
      });
    } else {
      fs.unlinkSync(req.file.path);
      res.status(404).json({
        success: false,
        message: "no such data added",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// ================================================

// get all  Project
const getProjects = async (req, res) => {
  try {
    // const { userRole } = req.params;
     
    const allProject = await ProjectSchema.find().populate("project_tasks");
    for (let i = 0; i < allProject.length; i++) {
      const allTasks = await taskSchema.find({projectId:allProject[i]._id});  
      Array.prototype.push.apply(allProject[i].project_tasks, allTasks);  
    }
    if (allProject) {
      res.status(200).json({
        success: true,
        message: "all Project list below",
        ProjectList: allProject,
      });
    } else {
      res.status(404)({
        success: false,
        message: "no Project found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// get all  Project via name
const getProjectsbyName = async (req, res) => {
  try {
    const { project_name } = req.params;
    const allProject = await ProjectSchema.find({ project_name });
    if (allProject) {
      res.status(200).json({
        success: true,
        message: "all Project list below",
        ProjectList: allProject,
      });
    } else {
      res.status(404)({
        success: false,
        message: "no Project found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// get   Project via id
const getProjectsbyId = async (req, res) => {
  try {
    const { _id } = req.params;
    const allProject = await ProjectSchema.find({ _id }).populate("project_tasks");
    const allTasks = await taskSchema.find({projectId:_id});
    
    Array.prototype.push.apply(allProject[0].project_tasks, allTasks);
  
    if (allProject) {
      res.status(200).json({
        success: true,
        message: "all Project list below",
        ProjectLists: allProject,
      });
    } else {
      res.status(404)({
        success: false,
        message: "no Project found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// update Project
const updateProject = async (req, res) => {
  try {
    const { _id } = req.params;
    const upgradeProject = await ProjectSchema.findByIdAndUpdate(
      { _id },
      req.body
    );
    if (upgradeProject != null) {
      await upgradeProject.save();
      return res.status(200).json({
        success: true,
        message: "Project details updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "no such Project",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete Project
const deleteProject = async (req, res) => {
  const { _id } = req.params;
  const selectdeleteProject = await ProjectSchema.findByIdAndDelete(
    { _id },
    req.body
  );
  try {
    if (selectdeleteProject != null) {
      res.status(200).json({
        success: true,
        message: "your Project deleted succrssfully",
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
module.exports = {
  addProject,
  
  getProjects,
  getProjectsbyName,
  getProjectsbyId,
  updateProject,
  deleteProject,
};
