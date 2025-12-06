const Bookmark = require('../Models/Bookmark');

// Create a new bookmark
exports.createBookmark = async (req, res) => {
  try {
    const { name, part, m1, m2, m3, m4, m5, m6 } = req.body;

    const bookmark = await Bookmark.create({
      name, part, m1, m2, m3, m4, m5, m6
    });

    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get by Id
exports.getById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findByPk(req.params.id);
    if (!bookmark) return res.status(404).json({ message: 'Not Found' });
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by Name
exports.getByName = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ where: { name: req.params.name } });
    if (!bookmark) return res.status(404).json({ message: 'Not Found' });
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get by Part
exports.getByPart = async (req, res) => {
  try {
    const bookmark = await Bookmark.findAll({ where: { part: req.params.part } });
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Id
exports.getAllId = async (req, res) => {
  try {
    const ids = await Bookmark.findAll({ attributes: ['id'] });
    res.json(ids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Name
exports.getAllName = async (req, res) => {
  try {
    const names = await Bookmark.findAll({ attributes: ['name'] });
    res.json(names);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Part
exports.getAllPart = async (req, res) => {
  try {
    const parts = await Bookmark.findAll({ attributes: ['part'] });
    res.json(parts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete by Id
exports.deleteById = async (req, res) => {
  try {
    const result = await Bookmark.destroy({ where: { id: req.params.id } });
    if (!result) return res.status(404).json({ message: 'Not Found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete by Name
exports.deleteByName = async (req, res) => {
  try {
    const result = await Bookmark.destroy({ where: { name: req.params.name } });
    if (!result) return res.status(404).json({ message: 'Not Found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete by Part
exports.deleteByPart = async (req, res) => {
  try {
    const result = await Bookmark.destroy({ where: { part: req.params.part } });
    if (!result) return res.status(404).json({ message: 'Not Found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a field (generic)
exports.updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;  // example: { name: "newName" } OR { m1: 10 }
    
    const [updated] = await Bookmark.update(updates, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Not Found' });

    const updatedBookmark = await Bookmark.findByPk(id);
    res.json({ success: true, data: updatedBookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
