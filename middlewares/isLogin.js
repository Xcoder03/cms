
import appError from "../errors/app-error";
import { obtainTokenFromHeader } from "../utils/obtainTokenFromHeader.js"
import { verifyToken } from "../utils/verifyToken.js";

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