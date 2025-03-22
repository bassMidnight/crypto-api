const { Op } = require("sequelize");
const { Transaction, Account, User, Currency, FiatCurrency } = require("../models");

exports.GetAllTransections = async (status, offset, limit) => {
    const transection = await Transaction.findAll({
        include : [
            {
                model: Account
            },
            {
                model: Currency
            },
            {
                model: FiatCurrency
            }
        ],
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
        include : [
            {
                model: Account,
            },
            {
                model: Currency,
            },
            {
                model: FiatCurrency,
            }
        ],
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
                required: true,
                include : [
                    {
                        model: User,
                        required: true,
                        where: {
                            id: id
                        }
                    }
                ]
            },
            {
                model: Currency,
                required: true,
            },
            {
                model: FiatCurrency,
                required: true,
            }
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