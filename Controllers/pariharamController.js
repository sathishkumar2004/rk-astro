const Pariharam = require('../Models/Pariharam');

// ➕ Create
exports.createPariharam = async (req, res) => {
  try {
    const { description, type } = req.body;
    const newPariharam = await Pariharam.create({ description, type });
    res.json(newPariharam);
  } catch (error) {
    res.status(500).json({ message: "Error creating Pariharam", error: error.message });
  }
};

// 📥 Get All
exports.getAllPariharams = async (req, res) => {
  try {
    const data = await Pariharam.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Pariharams", error: error.message });
  }
};

// 📤 Get by Type
exports.getPariharamsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const data = await Pariharam.findAll({ where: { type } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Pariharams by type", error: error.message });
  }
};

// ✏️ Update
exports.updatePariharam = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, type } = req.body;
    const updated = await Pariharam.update(
      { description, type },
      { where: { id } }
    );
    res.json({ message: "Pariharam updated", updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating Pariharam", error: error.message });
  }
};

// ❌ Delete
exports.deletePariharam = async (req, res) => {
  try {
    const { id } = req.params;
    await Pariharam.destroy({ where: { id } });
    res.json({ message: "Pariharam deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Pariharam", error: error.message });
  }
};
