const { Op } = require("sequelize");
const {Payment} = require("../models");

exports.GetPaymentByUserId = async (id) => {
    const payment = await Payment.findAll({
        where: {
            userId: id
        }
    });
    if(!payment) return null;
    return payment;
}

exports.CreatePayment = async (data) => {
    const payment = await Payment.create(data);
    if(!payment) return null;
    return payment;
}

exports.DeletePayment = async (id) => {
    const payment = await Payment.destroy({
        where: {
            id: id
        }
    });
    if(!payment) return null;
    return payment;
}

exports.DeletepaymentsByUserId = async (id) => {
    const payment = await Payment.destroy({
        where: {
            userId: id
        }
    });
    if(!payment) return null;
    return payment;
}

exports.DeleteAllPayments = async () => {
    const payment = await Payment.destroy();
    if(!payment) return null;
    return payment;
}