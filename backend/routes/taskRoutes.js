const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Task = require('../models/taskModel');

// @route   GET /api/tasks
// @desc    Obtener todas las tareas del usuario
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        console.error('ERROR AL OBTENER TAREAS:', err);
        res.status(500).send('Error del Servidor');
    }
});

// @route   POST /api/tasks
// @desc    Añadir una nueva tarea
router.post('/', protect, async (req, res) => {
    const { description } = req.body;
    try {
        const newTask = new Task({
            user: req.user.id,
            description
        });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        // Log del error completo para depuración en Render
        console.error('ERROR AL CREAR TAREA:', err);
        res.status(500).send('Error del Servidor al crear la tarea');
    }
});

// @route   PUT /api/tasks/:id
// @desc    Actualizar una tarea
router.put('/:id', protect, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(task);
    } catch (err) {
        console.error('ERROR AL ACTUALIZAR TAREA:', err);
        res.status(500).send('Error del Servidor');
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Eliminar una tarea
router.delete('/:id', protect, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Tarea no encontrada' });
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado' });
        }
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Tarea eliminada' });
    } catch (err) {
        console.error('ERROR AL ELIMINAR TAREA:', err);
        res.status(500).send('Error del Servidor');
    }
});

module.exports = router;
