const errorMiddleware = (err,req,res,next)=>{
    req.flash("error",err.message)
    res.redirect("/list")
}

module.exports = errorMiddleware