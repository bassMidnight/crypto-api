const { FindAccountByPk } = require("../services/account.service.js");
const { FindCurrencyByPk } = require("../services/currency.service.js");
const { FindFiatcurrencyId } = require("../services/fiatcurrency.service.js");
const { GetBuySellOrder, GetBuySellOrderByUserID, CreateBuySellOrder, CancleOrder,  } = require("../services/order.service.js");
const { CreateTransection } = require("../services/transection.service.js");

const {BuySellOrder, Account, Transaction } = require("../models");
const dateFormat = require("../utils/dateFormat");

exports.GetAllOrders = async (req, res) => {
  try {

    const status = req.query.status || "PENDING";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const orders = await GetBuySellOrder(status, offset, limit);

    const result = orders.map((order) => ({
      id: order.id,
      accountId: order.accountId,
      currencyId: order.currencyId,
      currencyName: order.Currency?.dataValues.name || null,
      currencySymbol: order.Currency?.dataValues.symbol || null,
      fiatCurrencyId: order.fiatCurrencyId,
      fiatCurrencyName: order.FiatCurrency?.dataValues.name || null,
      fiatCurrencySymbol: order.FiatCurrency?.dataValues.symbol || null,
      price: order.price,
      quantity: order.quantity,
      status: order.status,
      orderType: order.orderType,
      createdAt: dateFormat.convertTimestampToDateTime(order.createdAt),
      updatedAt: dateFormat.convertTimestampToDateTime(order.updatedAt),
    }))
    return res.status(200).json({ message: "Orders retrieved successfully", result });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving orders", error });
  }
}

exports.GetAllOrdersByUserID = async (req, res) => {
  try {

    const orders = await GetBuySellOrderByUserID(req.params.userId);

    const result = orders.map((order) => ({
      id: order.id,
      accountId: order.accountId,
      currencyId: order.currencyId,
      currencyName: order.Currency?.dataValues.name || null,
      currencySymbol: order.Currency?.dataValues.symbol || null,
      fiatCurrencyId: order.fiatCurrencyId,
      fiatCurrencyName: order.FiatCurrency?.dataValues.name || null,
      fiatCurrencySymbol: order.FiatCurrency?.dataValues.symbol || null,
      price: order.price,
      quantity: order.quantity,
      status: order.status,
      orderType: order.orderType,
      createdAt: dateFormat.convertTimestampToDateTime(order.createdAt),
      updatedAt: dateFormat.convertTimestampToDateTime(order.updatedAt),
    }))
    return res.status(200).json({ message: "Orders retrieved successfully", result });
    
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving orders", error: error.message });
  }
}

// BATH(account) -> ETH
exports.CreateBuyOrder = async (req, res) => {
  try {
    const { accountId, currencyId, price, quantity } = req.body;

    const account = await FindAccountByPk(accountId);
    if (!account) throw new Error("Error finding account");
    if (account.fiatCurrencyId == null) throw new Error("Account has no fiat currency");

    const currency = await FindCurrencyByPk(currencyId);
    if (!currency) throw new Error("Error finding currency");

    const createData = {
      accountId,
      orderType : "BUY",
      price,
      quantity,
      status: "PENDING",
    };
    
    createData.currencyId = currencyId;
    createData.fiatCurrencyId = account.fiatCurrencyId;
    createData.totalAmount = Number(price) * Number(quantity);

    console.log(Number(createData.totalAmount) , Number(account.balance));
    
    if(Number(createData.totalAmount) > Number(account.balance)) throw new Error("Insufficient balance");
    const order = await CreateBuySellOrder(createData)
    if(!order) throw new Error("Error creating order");

    const transaction = await CreateTransection({
      accountId,
      amount: quantity,
      price,
      totalAmount: createData.totalAmount,
      currencyId,
      fiatCurrencyId: account.fiatCurrencyId,
      type: "TRADE",
      status: "PENDING",
    });
    
    if(!transaction) throw new Error("Error creating transaction");

    return res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Error creating order", error : error.message });
  }
};

// ETH(account) -> BATH
exports.CreateSellOrder = async (req, res) => {
  const { accountId, fiatCurrencyId, price, quantity } = req.body;

    const account = await FindAccountByPk(accountId);
    if (!account) throw new Error("Error finding account");
    if (account.currencyId == null) throw new Error("Account has no currency");

    const fiatcurrency = await FindFiatcurrencyId(fiatCurrencyId);
    if (!fiatcurrency) throw new Error("Error finding currency");

    const createData = {
      accountId,
      orderType : "SELL",
      price,
      quantity,
      status: "PENDING",
    };

    createData.currencyId = account.currencyId;
    createData.fiatCurrencyId = fiatCurrencyId;
    createData.totalAmount = Number(price) * Number(quantity);

    if(Number(quantity) > Number(account.balance)) throw new Error("Insufficient balance");

    const order = await CreateBuySellOrder(createData)
    if(!order) throw new Error("Error creating order");

    const transaction = await CreateTransection({
      accountId,
      amount: quantity,
      price,
      totalAmount: createData.totalAmount,
      currencyId : account.currencyId,
      fiatCurrencyId: fiatCurrencyId,
      type: "TRADE",
      status: "PENDING",
    });
    if(!transaction) throw new Error("Error creating transaction");

    return res.status(201).json({ message: "Order created successfully", order });
}

exports.CancleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await CancleOrder(id);
    console.log(order);
    
    if(!order) throw new Error("Error cancelling order");

    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
};

exports.matchOrders = async (req, res) => {
  try {
    // หาคำสั่งซื้อ (BUY) ที่ยังค้างอยู่ และคำสั่งขาย (SELL) ที่ตรงกัน
    const buyOrders = await BuySellOrder.findAll({
      where: { orderType: "BUY", status: "PENDING" },
      include: [{ model: Account }],
      order: [["price", "DESC"]] // คำสั่งซื้อที่ราคาเยอะสุด
    });

    const sellOrders = await BuySellOrder.findAll({
      where: { orderType: "SELL", status: "PENDING" },
      include: [{ model: Account }],
      order: [["price", "ASC"]] // คำสั่งขายที่ราคาต่ำสุด
    });

    // ลูปผ่านคำสั่งซื้อและขายที่ตรงกัน
    for (let buyOrder of buyOrders) {
      for (let sellOrder of sellOrders) {
        // ตรวจสอบว่าราคาตรงกัน
        if (buyOrder.price >= sellOrder.price) {
          const quantityToTrade = Math.min(buyOrder.quantity, sellOrder.quantity);
          
          
          // ตรวจสอบว่า balance ของทั้งสองฝั่งเพียงพอ
          if (buyOrder.dataValues.Account.dataValues.balance >= quantityToTrade * sellOrder.price && sellOrder.dataValues.Account.dataValues.balance >= quantityToTrade) {
            // คำนวณจำนวนเงินที่ต้องจ่าย
            const totalAmount = quantityToTrade * sellOrder.price;

            // อัปเดตคำสั่งซื้อและขาย
            await buyOrder.update({
              // quantity: buyOrder.quantity - quantityToTrade,
              status: buyOrder.quantity === 0 ? "COMPLETED" : "PENDING"
            });

            await sellOrder.update({
              // quantity: sellOrder.quantity - quantityToTrade,
              status: sellOrder.quantity === 0 ? "COMPLETED" : "PENDING"
            });

            // console.log({
            //   senderId: sellOrder.Account.userId, // ฝั่งขาย
            //   receiverId: buyOrder.Account.userId, // ฝั่งซื้อ
            //   accountId: buyOrder.accountId,
            //   amount: quantityToTrade,
            //   type: "TRADE",
            //   status: "COMPLETED",
            //   currencyId: sellOrder.currencyId,
            //   fiatCurrencyId: buyOrder.fiatCurrencyId
            // });

            // สร้างธุรกรรมการซื้อขาย
            await Transaction.create({
              senderId: sellOrder.Account.id, // ฝั่งขาย
              receiverId: buyOrder.Account.id, // ฝั่งซื้อ
              accountId: buyOrder.accountId,
              amount: quantityToTrade,
              type: "TRADE",
              status: "COMPLETED",
              currencyId: sellOrder.currencyId,
              fiatCurrencyId: buyOrder.fiatCurrencyId
            });

            // อัปเดตยอดเงินในบัญชีของทั้งสองฝั่ง
            await buyOrder.Account.update({
              balance: buyOrder.Account.balance - totalAmount
            });

            await sellOrder.Account.update({
              balance: sellOrder.Account.balance + totalAmount
            });

            console.log(`Order matched: ${quantityToTrade} ${sellOrder.currencyId} at ${sellOrder.price}`);
          }
        }
      }
    }

    return res.status(200).json({ message: "Orders matched successfully" });
  } catch (error) {
    console.error("Error matching orders:", error);
    return res.status(500).json({ message: "Error matching orders", error: error.message });
  }
};