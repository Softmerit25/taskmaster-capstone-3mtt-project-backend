import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: String,
    title: String,
    description: String,
    deadline: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    status: {
        type: String,
        enum: ['todo', 'progress', 'completed'],
        default:'todo'
    },
},{
    timestamps: true,
})

// indexing db for better query performance
taskSchema.index({userId: 1, email: 1, status: 1, priority: 1});

const Tasks = mongoose.models['Tasks'] || mongoose.model('Tasks', taskSchema);

export default Tasks;