const Admin = require('../Models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Raasi = require('../Models/Raasi');
const Star = require('../Models/Star');
const Laknam =require('../Models/Laknam');
const Join = require('../Models/Join'); 
const ThreeJoin = require('../Models/ThreeJoin');
const Sin = require('../Models/Sin');
const Thosham = require('../Models/Thosham');
const PermissionRequest = require('../Models/PermissionRequest');
const { IncomingForm } = require('formidable');
const XLSX = require('xlsx');
// const Raasi = require('../Models/Raasi');

const AdminPermission = require('../Models/AdminPermission');

exports.getPermissionsByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;  // assuming you pass adminId in URL like /permissions/:adminId

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    const permissions = await AdminPermission.findAll({
      where: { adminId }
    });

    if (!permissions || permissions.length === 0) {
      return res.status(404).json({ message: 'No permissions found for this admin' });
    }

    res.json({
      success: true,
      adminId,
      permissions
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { adminId: admin.id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      id: admin.id,  // ✅ fixed here
      role: 'admin'
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.requestAccess = async (req, res) => {
  try {
    const { moduleName } = req.body;
    const adminId = req.adminId; // from JWT

    // Check if already approved
    const existingRequest = await PermissionRequest.findOne({
      where: { adminId, moduleName, status: 'pending' }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already pending' });
    }

    await PermissionRequest.create({ adminId, moduleName });

    res.json({ message: 'Permission request submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Request access failed', error: err.message });
  }
};

exports.createRaasiPost = async (req, res) => {
  try {
    const { raasiId, content  ,type} = req.body;
    const adminId = req.admin.id; // from auth middleware

    const post = await Raasi.create({ raasiId, content, adminId,type });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post', error: err.message });
  }
};

exports.deleteRaasiPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const deleted = await Raasi.destroy({ where: { postId } });
    if (!deleted) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post', error: err.message });
  }
};

exports.updateRaasiPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const updated = await Raasi.update({ content }, { where: { postId } });
    if (!updated[0]) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating post', error: err.message });
  }
};

exports.getAllRaasiPosts = async (req, res) => {
  try {
    const posts = await Raasi.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
};

exports.getRaasiPostsByAdminId = async (req, res) => {
  try {
     const adminId = req.admin.id;
    const posts = await Raasi.findAll({ where: { adminId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Raasi posts by adminId', error: err.message });
  }
};

exports.getRaasiPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Raasi.findOne({ where: { postId } });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};

exports.getRaasiPostsByRaasiId = async (req, res) => {
  try {
    const { raasiId } = req.params;
    const posts = await Raasi.findAll({ where: { raasiId } });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts by raasiId', error: err.message });
  }
};

exports.bulkUploadRaasi = async (req, res) => {
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
        const { raasiId, type, content } = row;

        if (
          !raasiId || raasiId < 1 || raasiId > 12 ||
          !content ||
          (type && !validTypes.includes(type))
        ) {
          failed.push({ row, reason: 'Invalid data' });
          continue;
        }

        try {
         
          const raasiPost = await Raasi.create({
            raasiId,
            type: type || null,
            content,
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

exports.createStarPost = async (req, res) => {
  try {
    const { starId, description, type } = req.body;
    const adminId = req.admin.id;

    const post = await Star.create({ starId, description, type, adminId });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating Star post', error: err.message });
  }
};

exports.getStarPostsByAdminId = async (req, res) => {
  try {
     const adminId = req.admin.id;
    const posts = await Star.findAll({ where: { adminId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Star posts by adminId', error: err.message });
  }
};

exports.deleteStarPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await Star.destroy({ where: { postId } });
    if (deleted) return res.json({ message: 'Star post deleted' });
    res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Star post', error: err.message });
  }
};

exports.updateStarPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { starId, description, type } = req.body;

    const updated = await Star.update(
      { starId, description, type },
      { where: { postId } }
    );

    if (updated[0]) return res.json({ message: 'Star post updated' });
    res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating Star post', error: err.message });
  }
};

exports.getAllStarPosts = async (req, res) => {
  try {
    const posts = await Star.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error getting star posts', error: err.message });
  }
};

exports.getStarPostByPostId = async (req, res) => {
  try {
    const post = await Star.findOne({ where: { postId: req.params.postId } });
    if (post) return res.json(post);
    res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};

exports.getStarPostsByStarId = async (req, res) => {
  try {
    const posts = await Star.findAll({ where: { starId: req.params.starId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts by starId', error: err.message });
  }
};

exports.bulkUploadStar = async (req, res) => {
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
        const { starId, type, description } = row;

        if (
          !starId || starId < 1 || starId > 27 ||
          !type || !validTypes.includes(type)
        ) {
          failed.push({ row, reason: 'Invalid data' });
          continue;
        }

        try {
          const post = await Star.create({
            starId,
            type,
            description: description || null,
            adminId
          });
          success.push(post);
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

exports.createLaknamPost = async (req, res) => {
  try {
    const { LaknamId, content, type } = req.body;
    const adminId = req.admin.id;

    const post = await Laknam.create({
      LaknamId,
      content,
      type,
      adminId
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ 
      message: 'Error creating Laknam post', 
      error: err.message 
    });
  }
};

exports.getLaknamPostsByAdminId = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const posts = await Laknam.findAll({ where: { adminId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Laknam posts by adminId', error: err.message });
  }
};

exports.deleteLaknamPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await Laknam.destroy({ where: { postId } });
    if (deleted) return res.json({ message: 'Laknam post deleted' });
    res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Laknam post', error: err.message });
  }
};

exports.updateLaknamPost = async (req, res) => {
  try {
    const { postId } = req.params;


    const updated = await Laknam.update(
      req.body,
      { where: { id: postId } } 
    );

    if (updated[0]) return res.json({ message: 'Laknam post updated' });
    res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating Laknam post', error: err.message });
  }
};

exports.getAllLaknamPosts = async (req, res) => {
  try {
    const posts = await Laknam.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error getting star posts', error: err.message });
  }
};

exports.getLaknamPostByPostId = async (req, res) => {
  try {
    const post = await Laknam.findOne({ where: { postId: req.params.postId } });
    if (post) return res.json(post);
    res.status(404).json({ message: 'Post not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post', error: err.message });
  }
};

exports.getLaknamPostsByLaknamId = async (req, res) => {
  try {
    const posts = await Laknam.findAll({ where: { LaknamId: req.params.laknamId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts by starId', error: err.message });
  }
};

exports.bulkUploadLaknam = async (req, res) => {
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
        const { LaknamId, type, content } = row;

        if (
          !LaknamId || LaknamId < 1 || LaknamId > 12 ||
          (type && !validTypes.includes(type))
        ) {
          failed.push({ row, reason: 'Invalid data' });
          continue;
        }

        try {
          const post = await Laknam.create({
            LaknamId,
            type: type || null,
            content: content || null,
            adminId
          });
          success.push(post);
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
      return res.status(500).json({ message: 'Error processing Excel file' });
    }
  });
};

exports.createJoinPost = async (req, res) => {
  try {
    const { JoinId, description, postId ,type} = req.body;
    const adminId = req.admin.id;
    const post = await Join.create({ JoinId, description, postId, adminId,type });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating Join post', error: err.message });
  }
};

exports.getJoinPostsByAdminId = async (req, res) => {
  try {
     const adminId = req.admin.id;
    const posts = await Join.findAll({ where: { adminId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Join posts by adminId', error: err.message });
  }
};

exports.getAllJoinPosts = async (req, res) => {
  try {
    const posts = await Join.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Join posts', error: err.message });
  }
};

exports.getJoinPostByPostId = async (req, res) => {
  try {
    const post = await Join.findOne({ where: { postId: req.params.postId } });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Join post by PostId', error: err.message });
  }
};

exports.getJoinPostsByJoinId = async (req, res) => {
  try {
    const posts = await Join.findAll({ where: { JoinId: req.params.JoinId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts by JoinId', error: err.message });
  }
};

exports.updateJoinPost = async (req, res) => {
  try {
    const updated = await Join.update(req.body, {
      where: { postId: req.params.postId }
    });
    res.json({ message: 'Join post updated', result: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating Join post', error: err.message });
  }
};

exports.deleteJoinPost = async (req, res) => {
  try {
    await Join.destroy({ where: { postId: req.params.postId } });
    res.json({ message: 'Join post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Join post', error: err.message });
  }
};

exports.bulkUploadJoin = async (req, res) => {
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
      const success = [];
      const failed = [];
      const validTypes = ['Strong', 'Weak', 'Positive', 'Negative'];

      for (const row of rows) {
        const { JoinId, description, postId ,type} = row;

        if (
          !JoinId || typeof JoinId !== 'number' ||
          !description || typeof description !== 'string' ||
          !postId || typeof postId !== 'string'
        ) {
          failed.push({ row, reason: 'Invalid data' });
          continue;
        }

        try {
          const post = await Join.create({
            JoinId,
            description,
            postId,
            adminId,
            type: type || null
          });
          success.push(post);
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
      return res.status(500).json({ message: 'Error processing Excel file' });
    }
  });
};

exports.createThreeJoinPost = async (req, res) => {
  try {
    const { postId, description, JoinId,adminId } = req.body;
    // const adminId = req.adminId;
    const post = await ThreeJoin.create({ postId, description, JoinId, adminId });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating ThreeJoin post', error: err.message });
  }
};

exports.getAllThreeJoinPosts = async (req, res) => {
  try {
    const posts = await ThreeJoin.findAll();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all ThreeJoin posts', error: err.message });
  }
};

exports.getThreeJoinPostByPostId = async (req, res) => {
  try {
    const post = await ThreeJoin.findOne({ where: { postId: req.params.postId } });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post by ID', error: err.message });
  }
};

exports.getThreeJoinPostsByThreeJoinId = async (req, res) => {
  try {
    const posts = await ThreeJoin.findAll({ where: { JoinId: req.params.threeJoinId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts by ThreeJoinId', error: err.message });
  }
};

exports.updateThreeJoinPost = async (req, res) => {
  try {
    const post = await ThreeJoin.update(req.body, { where: { JoinId: req.params.postId } });
    res.json({ message: 'ThreeJoin post updated', post });
  } catch (err) {
    res.status(500).json({ message: 'Error updating ThreeJoin post', error: err.message });
  }
};

exports.deleteThreeJoinPost = async (req, res) => {
  try {
    await ThreeJoin.destroy({ where: { JoinId: req.params.postId } });
    res.json({ message: 'ThreeJoin post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting ThreeJoin post', error: err.message });
  }
};

exports.createSinPost = async (req, res) => {
  try {
    const { postId, description ,sinId,type} = req.body;
    const adminId = req.admin.id;
     if (!postId || !adminId || !description || !sinId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const post = await Sin.create({ postId, adminId, description, sinId ,type});
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Sin post', error: error.message });
  }
};
exports.bulkUploadSin = async (req, res) => {
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
        const { postId, type, description,sinId } = row;

        if (
          !sinId || sinId < 1 || sinId > 12 ||
          !description ||
          (type && !validTypes.includes(type))
        ) {
          failed.push({ row, reason: 'Invalid data' });
          continue;
        }

        try {
         
          const sinPost = await Sin.create({
            postId,
            sinId,
            type: type || null,
            description,
            adminId
          });
          success.push(sinPost);
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
exports.getSinPostsByAdminId = async (req, res) => {
  try {
 const adminId = req.admin.id;
    const posts = await Sin.findAll({ where: { adminId } });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Sin posts by adminId', error: err.message });
  }
};

exports.getAllSinPosts = async (req, res) => {
  try {
    const posts = await Sin.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Sin posts', error: error.message });
  }
};

exports.getSinPostByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Sin.findOne({ where: { postId } });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post by ID', error: error.message });
  }
};

exports.getSinPostsBySinId = async (req, res) => {
  try {
    const sinId = req.params.sinId;
    const posts = await Sin.findAll({ where: { sinId } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by SinId', error: error.message });
  }
};

exports.updateSinPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { description, sinId } = req.body;
    const updated = await Sin.update({ description, sinId }, { where: { postId } });
    res.json({ message: 'Post updated successfully', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

exports.deleteSinPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    await Sin.destroy({ where: { postId } });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

exports.createThosham = async (req, res) => {
  try {
    const { description ,type} = req.body;
    const thosham = await Thosham.create({ description,type });
    res.json(thosham);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Thosham', error: error.message });
  }
};

exports.getAllThosham = async (req, res) => {
  try {
    const data = await Thosham.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Thosham', error: error.message });
  }
};

exports.getThoshamById = async (req, res) => {
  try {
    const thosham = await Thosham.findByPk(req.params.id);
    if (!thosham) return res.status(404).json({ message: 'Thosham not found' });
    res.json(thosham);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Thosham by ID', error: error.message });
  }
};

exports.updateThosham = async (req, res) => {
  try {
    const { description } = req.body;
    const thosham = await Thosham.findByPk(req.params.id);
    if (!thosham) return res.status(404).json({ message: 'Thosham not found' });

    await thosham.update({ description });
    res.json(thosham);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Thosham', error: error.message });
  }
};

exports.deleteThosham = async (req, res) => {
  try {
    const thosham = await Thosham.findByPk(req.params.id);
    if (!thosham) return res.status(404).json({ message: 'Thosham not found' });

    await thosham.destroy();
    res.json({ message: 'Thosham deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Thosham', error: error.message });
  }
};

