import Order from "../models/Order.js";

export const createOrder = async (req, res, next) => {
  try {
    const { tableNumber, items } = req.body;
    if (!tableNumber || !items || !items.length) {
      return res.status(400).json({ message: "Table number and items are required" });
    }
    const order = await Order.create({ tableNumber, items });

    const io = req.app.get("io");
    if (io) {
      io.emit("newOrder", order);
    }

    res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  };

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["pending", "preparing", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

