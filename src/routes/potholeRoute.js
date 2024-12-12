const express = require("express");
const router = express.Router();

const {
  createComment,
  getComment,
  getPothole,
} = require("../controllers/potholeControllers");

router.post("/comment", createComment);
router.get("/comment", getComment);
router.get("/", getPothole);

module.exports = router;
