const Flower = require('../Models/Flower');

// Create
exports.createFlower = async (req, res) => {
  try {
    const { description,type } = req.body;
    const flower = await Flower.create({ description,type });
    res.json(flower);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Flower', error: error.message });
  }
};

// Get All
exports.getAllFlowers = async (req, res) => {
  try {
    const flowers = await Flower.findAll();
    res.json(flowers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flowers', error: error.message });
  }
};

// Get by ID
exports.getFlowerById = async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) return res.status(404).json({ message: 'Flower not found' });
    res.json(flower);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flower', error: error.message });
  }
};

// Update
exports.updateFlower = async (req, res) => {
  try {
    const { description } = req.body;
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) return res.status(404).json({ message: 'Flower not found' });

    flower.description = description;
    await flower.save();

    res.json(flower);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flower', error: error.message });
  }
};

// Delete
exports.deleteFlower = async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) return res.status(404).json({ message: 'Flower not found' });

    await flower.destroy();
    res.json({ message: 'Flower deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flower', error: error.message });
  }
};
