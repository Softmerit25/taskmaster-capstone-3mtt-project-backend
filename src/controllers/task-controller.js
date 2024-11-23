import Tasks from "../models/task-model.js"

// FUNCTION TO CREATE A TASK
export const createTask = async (req, res, next) => {
    try {
      const { body, params, user } = req;

      // Validate user permission
      if (user.id !== params.id) {
        return res.status(403).json({
          status: 'error',
          error: 'User permission mismatch!',
        });
      }
  

      if (!body.title || !body.description || !body.deadline || !body.priority) {
        return res.status(400).json({
          status: 'error',
          error: 'All fields required!.',
        });
      }
  
      // Create the task
      const newTask = await Tasks.create({
        userId: params.id,
        ...body,
      });
  
    
      return res.status(201).json({
        status: 'success',
        message: 'Task created successfully',
        data: newTask,
      });
    } catch (error) {
      console.error(`Error during task creation: ${error}`);
      next(error);
    }
  };
  



// FUNCTION TO GET A TASK BASED ON A PARTICULAR USER
export const getSingleUserTasks = async(req, res, next)=>{
        const { user } = req;
    try {
        const tasks = await Tasks.find({userId: user.id}).sort({createdAt: -1});

        if(!tasks  || tasks.length === 0){
            return res.status(404).json({
                status: 'failed',
                error: 'No task found for this particular user'
            })
        }

        //get each user todo status updates length
         const countTodoStatus = {
            allTodos: tasks && tasks.length || 0,
            todo: tasks && tasks.filter((task)=> task.status === 'todo').length || 0,
            progress: tasks && tasks.filter((task)=> task.status === 'progress').length || 0,
            completed: tasks && tasks.filter((task)=> task.status === 'completed').length || 0,
         }

        return res.status(201).json({
            status: 'success',
            message: 'All tasks retrieved!',
            data:{
                tasks,
                count: countTodoStatus,
            }
        });
    } catch (error) {
        console.log(`Error during getting single user task and count: ${error}`);
        next(error);
    }
}


// FUNCTION TO UPDATE SINGLE USER TASK
export const updateSingleUserTask = async(req, res, next)=>{
    try {
        const { body, params, user } = req;
  
      const existingTask = await Tasks.findOne({_id: params.taskId});

      if(!existingTask) {
        return res.status(404).json({
          status: 'failed',
          error: 'No task found with the provided details!'
        })
      }


        // Validate user permission
        if (user.id !== existingTask.userId) {
          return res.status(403).json({
            status: 'error',
            error: 'User permission mismatch!',
          });
        }

    // Validate body (optional: whitelist allowed fields)
    const allowedUpdates = ['title', 'description', 'deadline', 'priority', 'status'];
    const isValidUpdate = Object.keys(body).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid fields in request body.',
      });
    }


    const updatedTask = await Tasks.findOneAndUpdate({userId: user.id, _id: params.taskId}, {$set: body}, {new: true});

    if (!updatedTask) {
        return res.status(404).json({
          status: 'error',
          error: 'Task not found!',
        });
      }


    return res.status(201).json({
        status: 'success',
        message: 'Task updated successful!',
        data: updatedTask,
    })
    } catch (error) {
        console.log(`Error during updating of single user tasks data: ${error}`);
        next(error);
    }
}




// FUNCTION TO DELETE SINGLE USER TASK
export const deleteSingleUserTask = async (req, res, next) => {
    try {
      const { params, user } = req;
  
      const existingTask = await Tasks.findOne({_id: params.taskId});

      if(!existingTask) {
        return res.status(404).json({
          status: 'failed',
          error: 'No task found with the provided details!'
        })
      }


        // Validate user permission
        if (user.id !== existingTask.userId) {
          return res.status(403).json({
            status: 'error',
            error: 'User permission mismatch!',
          });
        }
  
      // Delete task
      const deletedTask = await Tasks.findOneAndDelete({
        _id: params.taskId, 
        userId: user.id,  
      });
  
      // Handle case where task is not found
      if (!deletedTask) {
        return res.status(404).json({
          status: 'error',
          error: 'Task not found!',
        });
      }
  
   
      return res.status(201).json({
        status: 'success',
        message: 'Task deleted successfully!',
        data: deletedTask, 
      });
    } catch (error) {
      console.error(`Error during deleting a single user task: ${error.message}`);
      next(error);
    }
  };
  