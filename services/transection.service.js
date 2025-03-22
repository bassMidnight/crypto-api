const { Op } = require("sequelize");
const { Transaction } = require("../models");

exports.GetAllTransections = async (status, offset, limit) => {
    const transection = await Transaction.findAll({
        where: {
            status: status
        },
        offset,
        limit
    });
    if(!transection) return null;
    return transection;
}

exports.GetTransectionsByAccountID = async (id) => {
    const transection = await Transaction.findAll({
        where: {
            accountId: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.GetTransectionsByUserID = async (id) => {
    const transection = await Transaction.findAll({
        include : [
            {
                model: Account,
                include : [
                    {
                        model: User,
                        where: {
                            id: id
                        }
                    }
                ]
            },
        ]
    });
    if(!transection) return null;
    return transection;
}

exports.CreateTransection = async (data) => {
 
    const transection = await Transaction.create(data);
    
    if(!transection) return null;
    return transection;
}

exports.DeleteTransection = async (id) => {
    const transection = await Transaction.destroy({
        where: {
            id: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.DeleteTransectionsByUserId = async (id) => {
    const transection = await Transaction.destroy({
        where: {
            userId: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.DeleteAllTransections = async () => {
    const transection = await Transaction.destroy();
    if(!transection) return null;
    return transection;
}

exports.DeleteTransectionbyAccountID = async (id) => {
    const transection = await Transaction.destroy({
        where: {
            accountId: id
        }
    });
    if(!transection) return null;
    return transection;
}

exports.DeleteTransectionbyUserID = async (id) => {
    const transection = await Transaction.destroy({
        include : [
            {
                model: Account,
                include : [
                    {
                        model: User,
                        where: {
                            id: id
                        }
                    }
                ]
            },
        ]
    });
    if(!transection) return null;
    return transection;
}