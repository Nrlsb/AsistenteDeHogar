import MealPlan from '../models/mealPlanModel.js';

// @desc    Get meal plans for the logged-in user
// @route   GET /api/meals
// @access  Private
const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id });
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new meal plan
// @route   POST /api/meals
// @access  Private
const createMealPlan = async (req, res) => {
  const { day, mealType, recipe } = req.body;
  if (!day || !mealType || !recipe) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  try {
    const mealPlan = await MealPlan.create({
      day,
      mealType,
      recipe,
      user: req.user.id,
    });
    res.status(201).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a meal plan
// @route   PUT /api/meals/:id
// @access  Private
const updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a meal plan
// @route   DELETE /api/meals/:id
// @access  Private
const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    await mealPlan.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getMealPlans, createMealPlan, updateMealPlan, deleteMealPlan };
