const Thandhirikam = require('../Models/Thandhirikam');

// ➕ Create Thandhirikam
exports.createThandhirikam = async (req, res) => {
  try {
    const thandhirikam = await Thandhirikam.create({
      description: req.body.description,type:req.body.type
    });
    res.status(201).json(thandhirikam);
  } catch (error) {
    res.status(500).json({ message: "Error creating Thandhirikam", error: error.message });
  }
};

// 📄 Get All Thandhirikams
exports.getAllThandhirikams = async (req, res) => {
  try {
    const thandhirikams = await Thandhirikam.findAll();
    res.json(thandhirikams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Thandhirikams", error: error.message });
  }
};

// 🔍 Get Single Thandhirikam
exports.getThandhirikamById = async (req, res) => {
  try {
    const thandhirikam = await Thandhirikam.findByPk(req.params.id);
    if (!thandhirikam) return res.status(404).json({ message: "Thandhirikam not found" });
    res.json(thandhirikam);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Thandhirikam", error: error.message });
  }
};

// ✏️ Update Thandhirikam
exports.updateThandhirikam = async (req, res) => {
  try {
    const thandhirikam = await Thandhirikam.findByPk(req.params.id);
    if (!thandhirikam) return res.status(404).json({ message: "Thandhirikam not found" });

    thandhirikam.description = req.body.description || thandhirikam.description;
    await thandhirikam.save();
    res.json(thandhirikam);
  } catch (error) {
    res.status(500).json({ message: "Error updating Thandhirikam", error: error.message });
  }
};

// 🗑 Delete Thandhirikam
exports.deleteThandhirikam = async (req, res) => {
  try {
    const thandhirikam = await Thandhirikam.findByPk(req.params.id);
    if (!thandhirikam) return res.status(404).json({ message: "Thandhirikam not found" });

    await thandhirikam.destroy();
    res.json({ message: "Thandhirikam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Thandhirikam", error: error.message });
  }
};
