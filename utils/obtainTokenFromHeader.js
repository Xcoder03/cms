import appError from "../errors/app-error"
import redisClient from "../config/redisConfig"

export const obtainTokenFromHeader =  ((req,res,next )=>{
    const headerDetails = req.headers;

    const token = headerDetails['authorization'].split(" ")[1];

    if (token !== undefined) {
        // Check if the token is in the Redis blacklist
        redisClient.get(token, (err, reply) => {
          if (err) {
            console.error(err);
            return next(appError("Internal Server Error", 500));
          }
    
          if (reply) {
            return next(appError("Token has been revoked", 401));
          }
    
          // If the token is not in the blacklist, pass it to the next middleware
          req.token = token;
          next();
        });
      }else{ 
        return  next(appError("It seems there is no token attached to the header",401))
        
    }
})