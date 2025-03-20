const { Op } = require("sequelize");
const { User } = require("../models");

exports.FindAllUsers = async (search = "", offset, size) => {
    try {

        console.log("search : ", search);
        console.log("offset : ", offset);
        console.log("size : ", size);
        
        const users = await User.findAll(
            {
                where: {
                    [Op.or]: [
                        {username: {
                            [Op.like]: `%${search}%`,
                        }},
                        {email: {
                            [Op.like]: `%${search}%`,
                        }}
                    ]
                },
                limit: size,
                offset: offset,
            }
        );
        return users;
    } catch (error) {
        console.error("Error finding users:", error.message);
        return null;
    }
};

exports.FindUserByPk = async (id) => {
    try {
        const user = await User.findByPk(id);
        return user;
    } catch (error) {
        console.error("Error finding user:", error.message);
        return null;
    }
};

exports.UpdateUser = async (id, data) => {
    try {
        const user = await User.update(data, { where: { id } });
        return user;
    } catch (error) {
        console.error("Error updating user:", error.message);
        return null;
    }
};