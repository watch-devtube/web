const asyncHandler = require('express-async-handler')
const router = require("express").Router();
const { statsForever } = require("../libs/Stats")

router.get("/", asyncHandler(async (_req, res) => {
  const stats = await statsForever();
  res.json(stats);
}));

module.exports = router;
