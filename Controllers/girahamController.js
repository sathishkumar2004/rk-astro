const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const Giraham = require('../Models/Giraham');
const { IncomingForm } = require('formidable');


// ➕ Create Giraham
exports.createGiraham = async (req, res) => {
  try {
    const { girahamId, description,type } = req.body;
    const adminId = req.admin.id;

    const giraham = await Giraham.create({
      girahamId,     // ✅ foreign key / module ID
      description,   // ✅ content
      adminId ,type       // ✅ who created it
    });

    res.status(201).json(giraham);
  } catch (error) {
    res.status(500).json({
      message: "Error creating Giraham",
      error: error.message
    });
  }
};

// 📄 Get All Giraham
exports.getAllGirahams = async (req, res) => {
  try {
    const girahams = await Giraham.findAll();
    res.json(girahams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Girahams", error: error.message });
  }
};

// 🔍 Get Single Giraham
exports.getGirahamById = async (req, res) => {
  try {
    const giraham = await Giraham.findByPk(req.params.id);
    if (!giraham) return res.status(404).json({ message: "Giraham not found" });
    res.json(giraham);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Giraham", error: error.message });
  }
};

exports.getGirahamByGId = async (req, res) => {
  try {
    const giraham = await Giraham.findAll({where:{girahamId:req.params.id}});
    if (!giraham) return res.status(404).json({ message: "Giraham not found" });
    res.json(giraham);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Giraham", error: error.message });
  }
};

// ✏️ Update Giraham
exports.updateGiraham = async (req, res) => {
  try {
    const giraham = await Giraham.findByPk(req.params.id);
    if (!giraham) return res.status(404).json({ message: "Giraham not found" });

    giraham.description = req.body.description || giraham.description;
    await giraham.save();
    res.json(giraham);
  } catch (error) {
    res.status(500).json({ message: "Error updating Giraham", error: error.message });
  }
};

// 🗑 Delete Giraham
exports.deleteGiraham = async (req, res) => {
  try {
    const giraham = await Giraham.findByPk(req.params.id);
    if (!giraham) return res.status(404).json({ message: "Giraham not found" });

    await giraham.destroy();
    res.json({ message: "Giraham deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Giraham", error: error.message });
  }
};

exports.bulkUploadGiraham= async (req, res) => {
  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'File parsing error' });
    }

    const file = Array.isArray(files.excel) ? files.excel[0] : files.excel;

    if (!file) {
      return res.status(400).json({ message: 'No Excel file uploaded' });
    }

    try {
      const workbook = XLSX.readFile(file.filepath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const adminId = req.admin.id;
      const validTypes = ['Strong', 'Weak', 'Positive', 'Negative'];
      const success = [];
      const failed = [];

      for (const row of rows) {
        const { girahamId, description } = row;

        if (
          !girahamId || girahamId < 1 || girahamId > 12 ||
          !content ||
          (type && !validTypes.includes(type))
        ) {
          failed.push({ row, reason: 'Invalid data' });
          continue;
        }

        try {
         
          const girahamPost = await Raasi.create({
            girahamId,
            description,
            adminId
          });
          success.push(raasiPost);
        } catch (err) {
          failed.push({ row, reason: 'DB Error' });
        }
      }

      return res.status(200).json({
        message: 'Bulk upload completed',
        successCount: success.length,
        failedCount: failed.length,
        failed,
      });

    } catch (err) {
      console.error(err);
      console.log('Uploaded File:', files.excel);

      return res.status(500).json({ message: 'Error processing Excel file' });
    }
  });
};


