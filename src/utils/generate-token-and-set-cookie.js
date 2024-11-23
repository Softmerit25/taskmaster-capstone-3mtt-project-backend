import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (payload) =>{
    try {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1d'});
      return token;
    } catch (error) {
        console.log('Error in generate token and setting user cookie' + error);
        return res.status(500).json({status:'failed', error: 'Internal Server Error:' + error.message})
    }
}