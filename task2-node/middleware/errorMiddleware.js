const errorMiddleware = (err,req,res,next)=>{
    try{
        req.flash("error",err.message)
        res.redirect("/list")
        console.log(err.message)
    }catch(err){
        res.send(err)
    }
}

module.exports = errorMiddleware