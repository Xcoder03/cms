
import appError from "../errors/app-error.js";
import { obtainTokenFromHeader } from "../utils/obtaintokenfromheader.js";
import { verifyToken } from "../utils/verifytoken.js";

export const isLogin = async (req, res,next)=>{
   //get token header
  const token = obtainTokenFromHeader(req);
  //verify

  const userDeCoded  = verifyToken(token);

  req.userAuth = userDeCoded.id;

  if(!userDeCoded){
    return next(appError("Kindly login in, because it seems the token is either expired or invalid",401)) 
  }else{
    next()
  }
   
}