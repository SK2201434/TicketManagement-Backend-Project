const JWT = require('jsonwebtoken')
const User =require('../models/userSchema')

const isUser = async (req, res, next) => {
    if (req.params.userRole === "user") {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "You are not an authorized person as a user"
        });
    }
};

const isAdmin = async (req, res, next) => {
    if (req.params.userRole === "admin") {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "You are not an authorized person as an admin"
        });
    }
};

const isAdminAndUser = async (req, res, next) => {
    if (req.params.userRole === "admin" || req.params.userRole === "user") {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "You are not an authorized person"
        });
    }
};


const isClient = async (req, res, next) => {
    if (req.params.userRole === "client" || req.params.userRole === "admin") {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "You are not an authorized person as a client or admin"
        });
    }
};

module.exports = { isUser, isAdmin, isClient,isAdminAndUser };
