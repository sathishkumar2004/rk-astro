const  Mantrigam = require('../Models/Mantrigam');

exports.createMantrigam = async (req, res) => {
  try {
    const { description ,type} = req.body;
    const newMantrigam = await Mantrigam.create({ description,type });
    res.json(newMantrigam);
  } catch (error) {
    res.status(500).json({ message: "Error creating Mantrigam", error: error.message });
  }
};

exports.getAllMantrigam = async (req, res) => {
  try {
    const mantrigams = await Mantrigam.findAll();
    res.json(mantrigams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Mantrigam list", error: error.message });
  }
};

exports.getMantrigamById = async (req, res) => {
  try {
    const { id } = req.params;
    const mantrigam = await Mantrigam.findByPk(id);
    if (!mantrigam) return res.status(404).json({ message: "Mantrigam not found" });
    res.json(mantrigam);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Mantrigam", error: error.message });
  }
};

exports.updateMantrigam = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updated = await Mantrigam.update({ description }, { where: { id } });
    if (updated[0] === 0) return res.status(404).json({ message: "Mantrigam not found" });
    res.json({ message: "Mantrigam updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating Mantrigam", error: error.message });
  }
};

exports.deleteMantrigam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Mantrigam.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Mantrigam not found" });
    res.json({ message: "Mantrigam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Mantrigam", error: error.message });
  }
};
