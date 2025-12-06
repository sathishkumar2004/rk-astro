const Prasanam = require('../Models/Prasanam');

// ➕ Create Prasanam
exports.createPrasanam = async (req, res) => {
  try {
    const prasanam = await Prasanam.create({
      description: req.body.description,type:req.body.type
    });
    res.status(201).json(prasanam);
  } catch (error) {
    res.status(500).json({ message: "Error creating Prasanam", error: error.message });
  }
};

// 📄 Get All Prasanam
exports.getAllPrasanams = async (req, res) => {
  try {
    const prasanams = await Prasanam.findAll();
    res.json(prasanams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Prasanams", error: error.message });
  }
};

// 🔍 Get Single Prasanam
exports.getPrasanamById = async (req, res) => {
  try {
    const prasanam = await Prasanam.findByPk(req.params.id);
    if (!prasanam) return res.status(404).json({ message: "Prasanam not found" });
    res.json(prasanam);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Prasanam", error: error.message });
  }
};

// ✏️ Update Prasanam
exports.updatePrasanam = async (req, res) => {
  try {
    const prasanam = await Prasanam.findByPk(req.params.id);
    if (!prasanam) return res.status(404).json({ message: "Prasanam not found" });

    prasanam.description = req.body.description || prasanam.description;
    await prasanam.save();
    res.json(prasanam);
  } catch (error) {
    res.status(500).json({ message: "Error updating Prasanam", error: error.message });
  }
};

// 🗑 Delete Prasanam
exports.deletePrasanam = async (req, res) => {
  try {
    const prasanam = await Prasanam.findByPk(req.params.id);
    if (!prasanam) return res.status(404).json({ message: "Prasanam not found" });

    await prasanam.destroy();
    res.json({ message: "Prasanam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Prasanam", error: error.message });
  }
};
