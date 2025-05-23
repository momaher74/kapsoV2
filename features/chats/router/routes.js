const {sendMessage} = require("../controller/send_message");
const {createConversation} = require("../controller/create_conversation");

const router = require("express").Router() ; 

router.post("/createConversation" , createConversation)

router.post("/sendMessage" , sendMessage) 





module.exports = router