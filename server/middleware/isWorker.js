export default  (req, res, next) => {
        console.log(req.user)
        if(req.user.asWorker){
            return res.status(401).json({message: "Unauthorized"})
        } else {
            next();
        }
}