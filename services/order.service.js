const { Op } = require("sequelize");
const { BuySellOrder, Account, User, Currency, FiatCurrency } = require("../models");

//   const order = await BuySellOrder.create({
//     userId,
//     currencyId,
//     orderType,
//     price,
//     quantity,
//     status: "PENDING",
//   });

exports.GetBuySellOrder = async (status, offset, limit) => {
    const orders = await BuySellOrder.findAll({ 
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
        offset,
        limit
    });
    return orders;
}

exports.GetBuySellOrderByUserID = async (userId) => {
    const orders = await BuySellOrder.findAll({
        include: [
            {
                model: Account,
                include: {
                    model: User,
                    where: {
                        id: userId
                    }
                }
            },
            {
                model: Currency
            },
            {
                model: FiatCurrency
            }
        ]
    });
    return orders;
}


exports.CreateBuySellOrder = async (data) => {
    const order = await BuySellOrder.create(data);
    if(!order) {
        console.log("insert order failed.");
        return null;
    }
    return order;
}

exports.CancleOrder = async (id) => {
    const order = await BuySellOrder.update({ status: "CANCELLED" }, { where: { id } });
    if(!order) return null;
    return order;
}