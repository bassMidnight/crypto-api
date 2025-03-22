const { Op } = require("sequelize");
const { Transection } = require("../models");

exports.GetTransectionByUserId = async (id) => {
    const transection = await Transection.findAll({
        where: {
            userId: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.CreateTransection = async (data) => {
    const transection = await Transection.create(data);
    if(!transection) return null;
    return transection;
}

exports.DeleteTransection = async (id) => {
    const transection = await Transection.destroy({
        where: {
            id: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.DeleteTransectionsByUserId = async (id) => {
    const transection = await Transection.destroy({
        where: {
            userId: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.DeleteAllTransections = async () => {
    const transection = await Transection.destroy();
    if(!transection) return null;
    return transection;
}