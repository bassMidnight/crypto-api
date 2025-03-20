const { FindAllUsers, FindUserByPk } = require("../services/user.service");

const dateFormat = require("../utils/dateFormat");

exports.GetAllUsers = async (req, res) => {
  try {
    const { search, page, size } = req.query;
    const offset = (page - 1) * size;

    let users = await FindAllUsers(search, offset, Number(size));
    if(!users) return res.status(500).json({ message: "Error finding users" });

    users = users.map((user) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      kyc_status: user.kyc_status,
      created_at: dateFormat.convertTimestampToDateTime(user.createdAt),
      updated_at: dateFormat.convertTimestampToDateTime(user.updatedAt),
    }));

    return res.status(201).json({ message: "User created successfully", users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.approveKycUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await FindUserByPk(id);
    if(!user || user.length === 0) return res.status(400).json({ message: "User not found" });
    
    user = await UpdateUser(id, { kyc_status: true });
    if(!user) return res.status(500).json({ message: "Error updating user" });
    
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
