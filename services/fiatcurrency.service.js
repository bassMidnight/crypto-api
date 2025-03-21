const { Currency, FiatCurrency } = require("../models/index.js");

exports.FindAllFiatCurrencies = async (offset, limit) => {
    try {
        const currencies = await FiatCurrency.findAll({ offset, limit });
        if (!currencies) throw new Error('Error finding currencies');
        return currencies;
    } catch (error) {
        console.log("Error finding currencies:", error.message);
        return null;
    }
}

exports.UpdateFiatCurrency = async (id, data) => {
    try {
        const currency = await FiatCurrency.update(data, { where: { id } });
        return currency;
    } catch (error) {
        console.error("Error updating currency:", error.message);
        return null;
    }
}

exports.DeleteFiatCurrency = async (id) => {
    try {
        const currency = await FiatCurrency.destroy({ where: { id } });
        return currency;
    } catch (error) {
        console.error("Error deleting currency:", error.message);
        return null;
    }
}

exports.CreateFiatCurrency = async (name, symbol) => {
    try {
        const currency = await FiatCurrency.create({ name, symbol });
        return currency;
    } catch (error) {
        console.error("Error creating currency:", error.message);
        return null;
    }
}

exports.UpdateCurrency = async (id, data) => {
    try {
        const currency = await FiatCurrency.update(data, { where: { id } });
        return currency;
    } catch (error) {
        console.error("Error updating currency:", error.message);
        return null;
    }
}