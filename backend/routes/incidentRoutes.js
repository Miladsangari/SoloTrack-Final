const express = require("express");
const Incident = require("../models/Incident");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const incidents = await Incident.find().sort({ createdAt: -1 });
  res.json(incidents);
});

router.post("/", async (req, res) => {
  try {
    const incident = await Incident.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const updated = await Incident.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Incident.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
