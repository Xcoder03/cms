import appError from "../errors/app-error"

export const obtainTokenFromHeader =  ((req,res,next )=>{
    const headerDetails = req.headers;

    const token = headerDetails['authorization'].split(" ")[1];

    if(token !==undefined){
        return token
    }else{ 
        return  next(appError("It seems there is no token attached to the header",401))
        
    }
})