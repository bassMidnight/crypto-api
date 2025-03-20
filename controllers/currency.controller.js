const { FindAllCurrencies, FindAllCurrenciesByUserID, CreateCurrency } = require("../services/currency.service.js");
exports.GetAllCurrencies = async (req, res) => {
    try {

        const {page, size } = req.query;
        const offset = (page - 1) * size;

        const currencies = await FindAllCurrencies(offset, Number(size));
        
        return res.status(200).json({ message: "Currencies retrieved successfully", currencies });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.CreateCurrency = async (req, res) => {
    try {

        const { name, symbol } = req.body;

        const currency = await CreateCurrency(name, symbol);
        if(!currency) return res.status(500).json({ message: "Error creating currency" });
        
        return res.status(200).json({ message: "Currency created successfully", currency });
 
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.UpdateCurrency = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, symbol } = req.body;

        const currency = await UpdateCurrency(id, { name, symbol });
        if(!currency) return res.status(500).json({ message: "Error updating currency" });
        
        return res.status(200).json({ message: "Currency updated successfully", currency });
 
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

