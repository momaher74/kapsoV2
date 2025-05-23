const { createPost } = require("../controller/createPost");
const { deletePost } = require("../controller/deletePost");
const { getPostById } = require("../controller/getPostById");
const { getPosts } = require("../controller/getPosts");
const { updatePost } = require("../controller/updatePost");

const router = require("express").Router();

router.post("/", createPost);

router.delete("/:id", deletePost);


router.get("/:id", getPostById);


router.get("/", getPosts);
router.put("/", updatePost);

module.exports = router;
