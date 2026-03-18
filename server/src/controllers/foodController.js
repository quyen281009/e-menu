import Food from "../models/Food.js";

export const getFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ isAvailable: true })
      .sort({ category: 1, name: 1 });

    res.json(foods);
  } catch (err) {
    next(err);
  }
};

export const createFood = async (req, res, next) => {
  try {
    const { name, price, image, description, category } = req.body;
    const food = await Food.create({ name, price, image, description, category });
    res.status(201).json(food);
  } catch (err) {
    next(err);
  }
};

export const updateFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, image, description, category, isAvailable } = req.body;
    const food = await Food.findByIdAndUpdate(
      id,
      { name, price, image, description, category, isAvailable },
      { new: true },
    );
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json(food);
  } catch (err) {
    next(err);
  }
};

export const deleteFood = async (req, res, next) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json({ message: "Food deleted" });
  } catch (err) {
    next(err);
  }
};

export const getAvailableFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ isAvailable: true });
    res.json(foods);
  } catch (err) {
  next(err);
  }
};
