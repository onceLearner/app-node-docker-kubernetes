const express = require("express")

const app = express()


const simpleMiddleware=(req,res,next)=>{
    console.log('Im a middleware')
    next()
}

app.get("/hello",simpleMiddleware,(req,res)=>{

    res.send({msg:"hello world"})

})

app.listen(8080,()=>{
    console.log('app running!')
})