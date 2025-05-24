const express = require('express');
const {getMutualFollowers} = require("../controller/matualFollowers");
const {getFollowing} = require("../controller/getFollowing");
const {getFollowers} = require("../controller/getFollowers");
const {toggleFollow} = require("../controller/addAndRemoveFollow");
const router = express.Router();

router.post('/toggleFollow/:userId', authMiddleware, toggleFollow);
router.get('/followers/:userId', authMiddleware , getFollowers);
router.get('/following/:userId', authMiddleware, getFollowing);
router.get('/mutual/:userId', authMiddleware, getMutualFollowers);

module.exports = router;