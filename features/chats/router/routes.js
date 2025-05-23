const { sendMessage } = require("../controller/send_message");
const { createConversation } = require("../controller/create_conversation");
const { getConversionById } = require("../controller/getConversion");
const { getChatHistory } = require("../controller/chatHistory");

const router = require("express").Router();

router.post("/createConversation", createConversation);

router.post("/sendMessage", sendMessage);

router.get("/:id", getConversionById);
router.get("/", getChatHistory);

module.exports = router;
