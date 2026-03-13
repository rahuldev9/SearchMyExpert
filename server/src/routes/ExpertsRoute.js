const express = require("express");
const router = express.Router();

const { getExperts } = require("../controllers/expertController");

router.get("/users", getExperts);

module.exports = router;
