
import express from 'express';

const app = express();


//health check route
app.get("/health",(req, res) => {
    res.status(200).json({
        success: true,
        message: "server is healthy"
    })
})



export default app;
