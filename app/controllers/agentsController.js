const Ticket = require('../models/ticketModel')
const Comment = require('../models/commentModel')

const fs = require('fs');
const moment = require('moment');
const mdq = require('mongo-date-query');
const json2csv = require('json2csv').parse;
const path = require('path')
const fields = ['title', 'message', 'status'];

const userController = {
    viewSingleTicket : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "agent"){
                  //return res.json({'id':req.params.TeamId});
                  let comment;
                  let searchid = req.params.ticket_Id;
                  /* Comment.find({ticket_id, searchid}, (comm)=>{
                      comment = comm;
                  }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while retrieving teams."
                    });
                  }); */
                  Ticket.findById(req.params.ticket_Id)
                  .then(team => {
                    if(!team) {
                      return res.status(404).send({
                          message: "Ticket with id " + req.params.ticket_Id + "not found."
                      });            
                    }
                    team[comment] = comment
                    res.send(team);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving ticket."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
    },


    //user view single team

    editSupportRequest : (req, res) => {
        // return req.header('Authorization').split(' ').pop()
        try{
            session = req.session
            // if(session.theuser){
                if(session.theuser && req.session.theuser.role == "user"){
                    Ticket.findByIdAndUpdate(req.params.ticket_Id, req.body, { useFindAndModify: false })
                    res.json({'success':1, 'messsage':'ticket successfully updated'})
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            // }
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error});
        }
      },


    
    viewAllTickets : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "agent"){
                  //return res.json({'id':req.params.TeamId});
                  Ticket.find()
                  .then(ticket => {
                      res.send(ticket);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving tickets."
                      });
                  });
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error.message});
        }
    },

    viewClosedTickets : (req, res) => {
        try{
            session = req.session
            //if(session.theuser){
                if(req.session.theuser.role == "agent"){
                  //return res.json({'id':req.params.TeamId});
                //   Ticket.find({status:"closed", "created_at":{$lt: new Date(), $gte: new Date(new Date().getFullYear, new Date().getMonth-1, new Date().getDate)}},  (err, tickets) => {
                  Ticket.find({status:"closed", "created_at":mdq.lastMonth},  (err, tickets) => {
                    if (err) {
                      return res.status(500).json({ err });
                    }
                    else {
                      let csv
                      try {
                        csv = json2csv(tickets, { fields });
                      } catch (err) {
                        return res.status(500).json({ err });
                      }
                      const dateTime = moment().format('YYYYMMDDhhmmss');
                      const filePath = path.join(__dirname, "..", "public", "exports", "csv-" + dateTime + ".csv")
                      fs.writeFile(filePath, csv,  (err) => {
                        if (err) {
                          return res.json(err).status(500);
                        }
                        else {
                          setTimeout(function () {
                            fs.unlinkSync(filePath); // delete this file after 30 seconds
                          }, 60000)
                          return res.json("/exports/csv-" + dateTime + ".csv");
                        }
                      });
                
                    }
                })
                  /* .then(ticket => {
                      res.send(ticket);
                  }).catch(err => {
                      res.status(500).send({
                          message: err.message || "Some error occurred while retrieving tickets."
                      });
                  }); */
                }else{
                  res.json({'error': 'You not authorised to perform this action.'});
                }
            //}
            // res.json({'Access denied': 'Please login again'});
        }catch(error){
          return res.status(400).json({'error': error.message});
        }
    },

}

module.exports = userController

