const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/taskModel');

// Aplicamos el middleware a todas las rutas de este archivo
router.use(authMiddleware);

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Crear una nueva tarea
// @route   POST /api/tasks
router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ message: 'El texto de la tarea es obligatorio' });
    }
    try {
        const newTask = new Task({ text, user: req.user.id });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Actualizar una tarea (marcar como completada/incompleta)
// @route   PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        task.completed = !task.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

// @desc    Eliminar una tarea
// @route   DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await task.deleteOne(); // Usamos deleteOne() en el documento
        res.json({ message: 'Tarea eliminada' });

    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});


module.exports = router;
