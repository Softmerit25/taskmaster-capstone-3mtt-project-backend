import express from 'express'
import cors from 'cors'
import  'dotenv/config';
import helmet from 'helmet';
// import session from 'express-session';
import cookieParser from 'cookie-parser';
import { limiter } from './utils/limit-api-request.js';
import { router } from './routes/index.js';
import { db } from './config/db.js';

const app = express()


const PORT = process.env.PORT || 5500


// CORS ORIGIN MIDDLEWARE
const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) {
      
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true, 
  };
  
app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false, 
//     saveUninitialized: true, 
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000,
//       httpOnly: true, 
//       secure: process.env.NODE_ENV === 'production', 
//       sameSite: 'strict', 
//     },
//   }));
app.use(express.json());

// PROTECT ROUTE REQUEST VIA HTTP
app.use(helmet());



// Apply the rate limiter to all requests
app.use(limiter);

// ERROR HANDLING MIDDLEWARE
app.use(function(error, req, res, next){
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        status: statusCode,
        message: 'Internal Server Error',
        error: error?.message,
        stack: process.env.NODE_ENV === 'production' ? '' : error?.stack
    });
});

// ROUTES ENDPOINT
app.use('/api/v1', router);
 
app.get('/', (req, res)=>{
   return res.send('Hi, TaskMaster 3MTT Captone Project server is running...');
})


app.listen(PORT, ()=>{
    db();
    console.log(`Serving running on  ${PORT}`)
})
