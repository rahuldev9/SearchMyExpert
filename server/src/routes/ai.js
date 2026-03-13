const express = require("express");
const router = express.Router();

const { matchExperts } = require("../controllers/aiMatch");

router.post("/ai", matchExperts);

module.exports = router;
