import ShoppingItem from '../models/shoppingModels.js';

const getShoppingItems = async (req, res) => {
  try {
    const items = await ShoppingItem.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error in getShoppingItems:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createShoppingItem = async (req, res) => {
  const { name, quantity } = req.body;
  if (!name) return res.status(400).json({ message: 'Please add a name field' });
  try {
    const item = await ShoppingItem.create({ name, quantity, user: req.user.id });
    res.status(201).json(item);
  } catch (error) {
    console.error('Error in createShoppingItem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateShoppingItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });
    const updatedItem = await ShoppingItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error in updateShoppingItem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteShoppingItem = async (req, res) => {
  try {
    const item = await ShoppingItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });
    await item.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('Error in deleteShoppingItem:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getShoppingItems, createShoppingItem, updateShoppingItem, deleteShoppingItem };
