// controllers/superAdminController.js
const SuperAdmin = require('../Models/SuperAdmin');
const Admin =require('../Models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminPermission = require('../Models/AdminPermission');
const PermissionRequest = require('../Models/PermissionRequest');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await SuperAdmin.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Super Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await SuperAdmin.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Super Admin created', newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await SuperAdmin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'Super Admin not found' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, role: 'superadmin' }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ message: 'Login successful', token, admin });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

exports.createAdminAndGrantAccess = async (req, res) => {
  try {
    const { name, email, password, access } = req.body; // access = { laknam: 1, pariharam: 2 }

    // Step 1: Create admin
    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ name, email, password: hashed });

    // Step 2: Loop over access object and create AdminPermission rows
    const permissions = [];
    for (const { moduleName, moduleId } of access) {
      const perm = await AdminPermission.create({
        adminId: newAdmin.id,
        moduleName,
        moduleId
      });
      permissions.push(perm);

      // Step 3: Create individual PermissionRequest with status 'approved'
      await PermissionRequest.create({
        adminId: newAdmin.id,
        moduleName,
        moduleId,
        status: 'approved'
      });
    }

    res.json({
      message: `Admin created and granted access for modules: ${Object.keys(access).join(", ")}`,
      admin: newAdmin,
      permissions
    });

  } catch (err) {
    res.status(500).json({
      error: 'Operation failed',
      details: err.message
    });
  }
};


exports.addAdminPermission = async (req, res) => {
  try {
    const { adminId, permissions } = req.body;
    // permissions format: [{ moduleName: 'raasi', moduleId: 2 }, { moduleName: 'raasi', moduleId: 4 }]

    const added = [];

    for (const { moduleName, moduleId } of permissions) {
      const existing = await AdminPermission.findOne({
        where: { adminId, moduleName, moduleId }
      });

      if (!existing) {
        await AdminPermission.create({ adminId, moduleName, moduleId });

        await PermissionRequest.upsert({
          adminId,
          moduleName,
          moduleId,
          status: 'approved'
        });

        added.push({ moduleName, moduleId });
      }
    }

    res.status(200).json({
      message: 'Permissions added successfully',
      added
    });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to add permissions',
      error: err.message
    });
  }
};


exports.removeAdminPermission = async (req, res) => {
  try {
    const { adminId, permissions } = req.body;
    // permissions format: [{ moduleName: 'raasi', moduleId: 2 }]

    const removed = [];

    for (const { moduleName, moduleId } of permissions) {
      const permDeleted = await AdminPermission.destroy({
        where: { adminId, moduleName, moduleId }
      });

      const reqDeleted = await PermissionRequest.destroy({
        where: { adminId, moduleName, moduleId }
      });

      if (permDeleted || reqDeleted) {
        removed.push({ moduleName, moduleId });
      }
    }

    res.status(200).json({
      message: 'Permissions removed successfully',
      removed
    });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to remove permissions',
      error: err.message
    });
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password'] } // hide password for security
    });
    res.status(200).json({ admins });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admins', error: err.message });
  }
};



exports.getAllSuperAdmins = async (req, res) => {
  try {
    const superAdmins = await SuperAdmin.findAll({
      attributes: { exclude: ['password'] } // hide password
    });
    res.status(200).json({ superAdmins });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch super admins', error: err.message });
  }
};



// exports.grantAccess = async (req, res) => {
//   try {
//     const { adminId, moduleName } = req.body;

//     // Insert into permissions
//     await AdminPermission.create({ adminId, moduleName });

//     // Update request status
//     await PermissionRequest.update(
//       { status: 'approved' },
//       { where: { adminId, moduleName, status: 'pending' } }
//     );

//     res.json({ message: `Access granted for module ${moduleName}` });
//   } catch (err) {
//     res.status(500).json({ message: 'Grant access failed', error: err.message });
//   }
// };
