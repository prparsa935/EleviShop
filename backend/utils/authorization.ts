// import jwt from 'jsonwebtoken';
// const authorization=(req,res,next)=>{
//     let token=null
//     try {
//         token=req.headers.cookie?.access
        
//     } catch (error) {
        
//     }

    
//     if (token == null) return res.sendStatus(401)

//     jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
//       console.log(err)
  
//       if (err) return res.sendStatus(403)
  
//       req.user = user
  
//       next()
    
// })
// }
// export default authorization