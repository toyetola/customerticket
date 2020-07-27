const express = require("express")
const router = require("express").Router();
const adminController = require('../app/controllers/adminController');
var session ;

router.get("/", (req, res) => {
    session = req.session
    if(session.theuser){
        res.json({
            error: null,
            data: {
            title: "My dashboard",
            content: "dashboard content",
            user: req.user, // token payload information
            },
        });
    } else{
        res.json({'Access denied':'Login again'})
    } 
  
});

router.post('/registerAgent', adminController.createAgent)
router.get('/allTickets', adminController.retreiveAllTickets)
router.get('/singleTicket/:ticket_Id', adminController.retrieveOneTicket)
router.put('/updateTicket/:ticket_Id', adminController.updateTicket)
router.get('/deleteTicket/:ticket_Id', adminController.deleteTicket)


module.exports = router;