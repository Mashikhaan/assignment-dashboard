




//role-based authorization middleware
export const authorizeRolesMiddleware = (...roles) => {
    return (req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resources"
            })
        }
        
        next();
    }

}