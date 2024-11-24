import bcrypt from 'bcrypt'
import User from '../models/user-model.js'
import { generateTokenAndSetCookie } from '../utils/generate-token-and-set-cookie.js';


// CREATING NEW USER FUNCTION
export const userRegistration = async (req, res) => {
    const { fullName, email, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // body data validation on server
    if (!fullName) {
        return res.status(404).json({
            status: 'error',
            error: 'Please enter fullname!'
        });
    }


    if (!email && emailRegex.test(email)) {
        return res.status(404).json({
            status: 'error',
            error: 'Please enter a valid email address!'
        });
    }


    if (!password) {
        return res.status(404).json({
            status: 'error',
            error: 'Please enter a password!'
        });
    }

    try {

        // check if user already exist
        const user = await User.findOne({email});

        if(user){
            return res.status(403).json({
                status: 'failed',
                error: 'User already registered with the provided email address!'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashPassword
        })
 
        const {password: pass, ...payload} = newUser._doc;

        return res.status(201).json({
            status: "success",
            message:"User created ssuccessfully!",
            data: payload,
        })


    } catch (error) {
        console.log('Error in user registration controller:', error);
       return res.status(500).json({
            status: 'failed',
            error: 'Internal Server Error:' + error.message
        })
    }
}





// AUTHENTICATION USER CREDENTAILS BEFORE GRANDING ACCESS
export const userLogin = async (req, res) => {

     const { email, password} = req.body;

     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

     if (!email && emailRegex.test(email)) {
         return res.status(404).json({
             status: 'error',
             error: 'Please enter a valid email address!'
         });
     }
 
 
     if (!password) {
         return res.status(404).json({
             status: 'error',
             error: 'Please enter a password!'
         });
     }


    try {
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({
                status: 'failed',
                error: 'No user found with the provided credentails. kindly register!'
            })
        }


        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({
                status: 'failed',
                error: `Invalid user password!. Kindly reset if you can't remember!`
            })
        }

        // returning the login user data expect the password;
        const {password: pass, ...payload} = user._doc;

         // generate token for the user and set cookie
         const token = generateTokenAndSetCookie({id:user?._id, email: user?.email});

        return res.cookie(process.env.COOKIE_NAME, token, {
            signed: true,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        }).status(200).json({ 
            status: 'success', 
            message: 'Login successful', 
            data: payload })
    
    } catch (error) {
        console.log('Error in login user controller:', error);
        return res.status(500).json({
            status: 'failed',
            error: 'Error in login user controller:' + error.message
        })
    }
}




// FUNCTION TO LOGOUT USER
export const userLogOut = async (req, res) => {

   try {
       const user = await User.findOne({ email: req.user.email });

       if(!user){
           return res.status(404).json({
               status: 'failed',
               error: 'Permission mistach User not found!'
           })
       }


       // clear previous user token before setting a new one
       return res.clearCookie(process.env.COOKIE_NAME, {
        httpOnly: true,
        signed: true,
        secure: true,
        sameSite: 'none',
        }).status(200).json({ status: 'success', message: 'LogOut Successful!', })

   } catch (error) {
       console.log('Error in logout user controller:', error);
       return res.status(500).json({
           status: 'failed',
           error: 'Error in logout user controller:' + error.message
       })
   }
}




// CHECK USER AUTHENTICATION STATUS
export const checkAuthStatus = async (req, res) => {

   try {
       const user = await User.findOne({ email: req.user.email });

       if(!user){
           return res.status(404).json({
               status: 'failed',
               error: 'No user found with the provided credentails. kindly register!'
           })
       }

       // returning the login user data expect the password;
       const {password: pass, ...payload} = user._doc;
       return res.status(200).json({ 
           status: 'success', 
           message: 'Checking Auth Status Successful', 
           data: payload  })

   } catch (error) {
       console.log('Error during user status auth check controller:', error);
       return res.status(500).json({
           status: 'failed',
           error: 'Error during user status auth check controller:' + error.message
       })
   }
}
