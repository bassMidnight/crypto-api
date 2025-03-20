const { Account } = require('../models');

exports.FindAllAccounts = async (search, offset, limit) => {
    try {
        
        const whereClause = search ? { userId: search } : {};
        const accounts = await Account.findAll({ where: whereClause, limit, offset });
        if(!accounts) throw new Error('Error finding accounts');
        
        return accounts;
    } catch (error) {
        console.log("Error finding accounts:", error.message);
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