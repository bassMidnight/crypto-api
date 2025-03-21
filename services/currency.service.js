const { Currency } = require("../models/index.js");

exports.FindAllCurrencies = async (offset, limit) => {
    try {
        const currencies = await Currency.findAll({ offset, limit });
        if (!currencies) throw new Error('Error finding currencies');
        return currencies;
    } catch (error) {
        console.log("Error finding currencies:", error.message);
        return null;
    }
}

exports.CreateCurrency = async (name, symbol) => {
    try {
        const currency = await Currency.create({ name, symbol });
        return currency;
    } catch (error) {
        console.error("Error creating currency:", error.message);
        return null;
    }
}

exports.UpdateCurrency = async (id, data) => {
    try {
        const currency = await Currency.update(data, { where: { id } });
        return currency;
    } catch (error) {
        console.error("Error updating currency:", error.message);
        return null;
    }
}

exports.DeleteCurrency = async (id) => {
    try {
        const currency = await Currency.destroy({ where: { id } });
        return currency;
    } catch (error) {
        console.error("Error deleting currency:", error.message);
        return null;
    }
}