// CORRECCIÓN: Se usa import en lugar de require
import mongoose from 'mongoose';

const shoppingItemSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const ShoppingItem = mongoose.model('ShoppingItem', shoppingItemSchema);

// CORRECCIÓN: Se usa export default en lugar de module.exports
export default ShoppingItem;
