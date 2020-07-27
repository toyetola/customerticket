const express = require("express")
const router = require("express").Router();
const agentController = require('../app/controllers/agentsController');
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


router.get('/allTickets', agentController.viewAllTickets)
router.get('/singleTicket/:ticket_Id', agentController.viewSingleTicket)
router.put('/updateTicket/:ticket_Id', agentController.editSupportRequest)
router.get('/report', agentController.viewClosedTickets)


module.exports = router;