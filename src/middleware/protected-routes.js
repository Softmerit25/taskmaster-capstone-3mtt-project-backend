import jwt from 'jsonwebtoken';
import User from '../models/user-model.js';


export const protectRoutes = async (req, res, next)=>{

    const token = req.signedCookies[process.env.COOKIE_NAME];
    
    if(!token){
        return res.status(401).json({
            status: 'failed',
            error: 'Error duing user authenication: Token not found!'
        })
    }

    // verify user token
    try {
    
     const decoded = jwt.verify(token, process.env.JWT_SECRET);

   // Retrieve the authenticated user's details
    const user = await User.findOne({_id: decoded.id});

    if(!user){
        return res.status(404).json({
            status: 'failed',
            error: 'Error in Token Controller: User Not Found or Token Mismatch!'
        })
     }

    req.user = user;
    next();
    } catch (error) {
       
        // Handle specific JWT errors
        let message = 'Error in token Authentication failed';
        if (error.name === 'TokenExpiredError') {
            message = 'Token has expired';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token';
        } else if (error.name === 'NotBeforeError') {
            message = 'Token not active';
        }

        console.error(`Error during token validation: ${error.message}`);

        return res.status(500).json({
            status: 'failed',
            error: `${message}: ${error.message}`,
        });
    }


}