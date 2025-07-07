// CORRECCIÓN: Se usa import en lugar de require
import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        description: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            required: true,
            default: false,
        },
        dueDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

// CORRECCIÓN: Se usa export default en lugar de module.exports
export default Task;
