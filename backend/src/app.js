
import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import courseRouter from './routes/course.route.js';
import assignmentRouter from './routes/assignment.route.js';

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//health check route
app.get("/health",(req, res) => {
     console.log("Test route reached");

    res.status(200).json({
        success: true,
        message: "server is healthy"
    })
})



//register routes
app.use("/api/auth", authRouter);
app.use("/api/courses", courseRouter);
app.use("/api/assignment", assignmentRouter)

export default app;
