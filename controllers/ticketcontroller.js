const express = require('express')
const ProjectSchema = require("../models/projectSchema");
const uploads = require('../middleware/multer')
const fs = require('fs');
const ticketSchema = require('../models/ticketSchema');
const axios = require('axios');




const addTicket = async (req, res) => {
    
    try {
        
        const ticketData = new ticketSchema(req.body);
    
        if (ticketData != null) {
            ticketData.userId = ticketData.userId;
            ticketData.projectId = req.params.pid;
    
            
            const savedTicket = await ticketData.save();
            console.log(savedTicket);
    
            // Now, make a request to the Linear API
            const linearApiResponse = await axios.post('https://api.linear.app/graphql', {
                query: `
                     mutation IssueCreate($input: IssueCreateInput!) {
                         issueCreate(input: $input) {
                           success
                           issue {
                             id
                             title
                             description
                           }
                         }
                       }
                     `,
                variables: {
                    input: {
                        title: ticketData.ticket_name,
                        description: ticketData.ticket_description,
                        teamId: "dfdc225f-9886-4df8-9203-23b4fdbe2367",
                        stateId: ticketData.stateId,
                        assigneeId: ticketData.assigneeId,
                        priority: ticketData.priority,
                        dueDate: ticketData.dueDate,
                        labelIds: ticketData.labelIds,
                    },
                },
            }, {
                headers: {
                    'Authorization': 'lin_api_39GJY8uD7ckIKstBkRIFZEd4gizEXxHfACyAWOwi',
                    'Content-Type': 'application/json',
                },
            });
    
            // Handle the linearApiResponse as needed
            console.log(linearApiResponse.data);
    
            // Send a success response
            res.status(200).json({
                success: true,
                message: 'Ticket added successfully',
                ticket: savedTicket,
                linearResponse: linearApiResponse.data,
            });
        }
    } catch (error) {
        // Handle errors
        console.error(error);
    
        // Send an error response
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

const getTickets = async (req, res) => {
    try {
        const allTicketList = await ticketSchemakSchema.find()
        if (allTicketList != null) {
            return res.status(200).json({
                sucess: true,
                message: "your all Ticket list below",
                TicketList: allTicketList
            })

        } else {
            res.status(404).json({
                success: false,
                message: "No Tickets Found"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error occurs${error.message}`
        })
    }
}



const getTicketAssignedProjects = async (req, res) => {
    try {
      const projectIdd = req.params.projectId; 
       const tickets= await ticketSchema.find({projectId:projectIdd});
     
      if (tickets) {
        res.status(200).json({
          success: true,
          message: "Assigned task for the user",
          assignedTickets: tickets,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Assigned tickets not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
  

const getTicketsByStatus = async (req, res) => {
    try {
        const { status } = req.query; // Assuming you'll pass the status as a query parameter

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status parameter is required",
            });
        }

        const tickets = await ticketSchema.find({ task_status: status });

        if (tickets.length > 0) {
            return res.status(200).json({
                success: true,
                message: `tickets with status '${status}'`,
                tickets,
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


const updateTicketStatus = async (req, res) => {
    try {
        const { _id } = req.params;
        const { ticket_status } = req.body; // Assuming you send the new status in the request body

        const updatedTicket = await ticketSchema.findByIdAndUpdate(_id,
            { ticket_status_status },
            { new: true } // To get the updated document after the update
        );

        if (!updatedTicket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Ticket status updated successfully",
            updatedTask,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


const editTicket = async (req, res) => {
    try {
        const { _id } = req.params
        const ticketedit = await ticketSchemaa.findByIdAndUpdate({ _id }, req.body)
        if (ticketedit!= null) {
            await ticketedit.save()
            res.status(200).json({
                success: true,
                message: "Ticket updated successfull ",
                Ticketedit: ticketedit
            })
        } else {
            res.status(404).json({
                success: false,
                message: "Ticket not  updated try again !! "
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


const deleteTicket = async (req, res) => {
    try {
        const { _id } = req.params
        const ticketdeleted = await taskSchema.findByIdAndDelete({ _id }, req.body)
        if (taskdeleted != null) {
            res.status(200).json({
                success: true,
                message: "Ticket deleted successfully",
                show:ticketdeleted
            })
        } else {
            res.status(404).json({
                success: false,
                message: "No Ticket deleted try again"
            })

        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}
module.exports = { addTicket, 
    getTickets, 
    getTicketAssignedProjects,
    getTicketsByStatus,
    updateTicketStatus,
    editTicket,
    deleteTicket }


