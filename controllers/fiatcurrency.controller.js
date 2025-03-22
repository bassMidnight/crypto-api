const { FindAllFiatCurrencies, CreateFiatCurrency, UpdateFiatCurrency, DeleteFiatCurrency} = require("../services/fiatcurrency.service.js");
exports.GetAllFiatCurrencies = async (req, res) => {
    try {

        const {page, size } = req.query;
        const offset = (page - 1) * size;

        const currencies = await FindAllFiatCurrencies(offset, Number(size));
        
        return res.status(200).json({ message: "Fiatcurrencies retrieved successfully", currencies });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.CreateFiatCurrency = async (req, res) => {
    try {

        const { name, symbol } = req.body;

        const currency = await CreateFiatCurrency(name, symbol);
        if(!currency) return res.status(500).json({ message: "Error creating Fiatcurrencies" });
        
        return res.status(200).json({ message: "Fiatcurrencies created successfully", currency });
 
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.UpdateFiatCurrency = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, symbol } = req.body;

        const currency = await UpdateFiatCurrency(id, { name, symbol });
        if(!currency) return res.status(500).json({ message: "Error updating Fiatcurrencies" });
        
        return res.status(200).json({ message: "Fiatcurrencies updated successfully", currency });
 
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.DeleteFiatCurrency = async (req, res) => {
    try {
        const { id } = req.params;
        const currency = await DeleteFiatCurrency(id);
        if(!currency) return res.status(500).json({ message: "Error deleting Fiatcurrencies" });
        
        return res.status(200).json({ message: "Fiatcurrencies deleted successfully", currency });
 
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}