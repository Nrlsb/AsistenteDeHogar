const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const { protect } = require('../middleware/authMiddleware');

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
});

// @desc    Añadir una nueva tarea
// @route   POST /api/tasks
// @access  Private
const addTask = asyncHandler(async (req, res) => {
    const { description, dueDate } = req.body; // Extraemos dueDate

    if (!description) {
        res.status(400);
        throw new Error('Por favor, añade una descripción');
    }

    const task = await Task.create({
        user: req.user.id,
        description,
        dueDate // Guardamos la fecha de vencimiento
    });

    res.status(201).json(task);
});

// @desc    Actualizar una tarea
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('No autorizado');
    }

    // Actualizamos los campos que lleguen en el body
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
    task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
});

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Tarea no encontrada');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('No autorizado');
    }

    await task.deleteOne();

    res.json({ id: req.params.id });
});

router.route('/').get(protect, getTasks).post(protect, addTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
