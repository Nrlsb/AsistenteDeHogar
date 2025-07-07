// CORRECCIÓN: Se usa import en lugar de require
import express from 'express';
import Task from '../models/taskModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all tasks for a user
router.get('/', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
});

// Create a task
router.post('/', protect, async (req, res) => {
    try {
        const { description, dueDate } = req.body;
        const task = new Task({ description, dueDate, user: req.user.id });
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(400).json({ message: 'Datos de tarea inválidos' });
    }
});

// Update a task
router.put('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task && task.user.toString() === req.user.id) {
            task.description = req.body.description || task.description;
            task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
            task.dueDate = req.body.dueDate; // Permite quitar la fecha
            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Tarea no encontrada o no autorizado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la tarea' });
    }
});

// Delete a task
router.delete('/:id', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task && task.user.toString() === req.user.id) {
            await Task.deleteOne({ _id: req.params.id });
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada o no autorizado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
});

// CORRECCIÓN: Se usa export default
export default router;
