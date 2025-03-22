const { Account } = require('../models');

exports.FindAllAccounts = async (search, offset, limit) => {
    try {
        
        const whereClause = search ? { userId: search } : null;
        console.log(limit, offset);
        
        const accounts = await Account.findAll({ where: whereClause, limit, offset });
        if(accounts.length === 0) {
            console.log("No accounts found");
            throw new Error("No accounts found");
        }
        if(!accounts) {
            console.log("Error finding accounts");
            throw new Error('Error finding accounts');
        }
        
        return accounts;
    } catch (error) {
        console.log("Error finding accounts:", error.message);
        return error.message;
    }
}

exports.FindAccountByPk = async (id) => {
    try {
        
        const account = await Account.findByPk(id);
        if(!account) throw new Error('Error finding account');
        
        return account;
    } catch (error) {
        console.log("Error finding account:", error.message);
        return null;
    }
}

exports.CreateAccount = async (data) => {
    try {
        
        const account = await Account.create(data);        
        if(!account) throw new Error('Error creating account');
        
        return account;
    } catch (error) {
        console.log("Error creating account:", error.message);
        return null;
    }
}

exports.UpdateAccount = async (id, data) => {
    try {
        
        const account = await Account.update(data, { where: { id } });
        if(!account) throw new Error('Error updating account');
        
        return account;
    } catch (error) {
        console.log("Error updating account:", error.message);
        return null;
    }
}

exports.DeleteAccount = async (id) => {
    try {
        
        const account = await Account.destroy({ where: { id } });
        if(!account) throw new Error('Error deleting account');
        
        return account;
    } catch (error) {
        console.log("Error deleting account:", error.message);
        return null;
    }
}