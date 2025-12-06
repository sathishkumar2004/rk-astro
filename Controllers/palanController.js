const Palan = require('../Models/Palan');

// ➕ Create Palan
exports.createPalan = async (req, res) => {
  try {
    const { palanId, description,adminId ,type } = req.body;
    // const adminId = req.admin.id;

    if (palanId < 1 || palanId > 9) {
      return res.status(400).json({ message: 'PalanId must be between 1 and 9' });
    }

    const palan = await Palan.create({ palanId, description, adminId,type });
    res.json(palan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating palan', error: error.message });
  }
};

// 📋 Get All
exports.getAllPalans = async (req, res) => {
  try {
    const palans = await Palan.findAll();
    res.json(palans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching palans', error: error.message });
  }
};

// ✏️ Update
exports.updatePalan = async (req, res) => {
  try {
    const { palanName, description } = req.body;
    const { palanId } = req.params;

    const palan = await Palan.findByPk(palanId);
    if (!palan) return res.status(404).json({ message: 'Palan not found' });

    palan.palanName = palanName || palan.palanName;
    palan.description = description || palan.description;

    await palan.save();
    res.json(palan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating palan', error: error.message });
  }
};

// 🗑️ Delete
exports.deletePalan = async (req, res) => {
  try {
    const { palanId } = req.params;
    const deleted = await Palan.destroy({ where: { palanId } });

    if (!deleted) return res.status(404).json({ message: 'Palan not found' });

    res.json({ message: 'Palan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting palan', error: error.message });
  }
};
