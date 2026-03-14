const express = require("express");
const router = express.Router();

const { getBusinesses } = require("../controllers/expertController");

router.get("/users", getBusinesses);

module.exports = router;
