/* OLD const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");


const validateToken = asyncHandler(async(req,res,next)=> {
    let token;
    let authHeader = req.headers.authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) =>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
            req.user = decoded.user;
            next();
        });
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or token is missing ");
        }
    }
});

module.exports = validateToken;
*/

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "User is not authorized or token is missing" });
    }

    token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "User is not authorized or token is missing" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decoded); // Log the decoded token
    req.user = decoded.user;
    console.log("Decoded User:", req.user); // Log the decoded user information
    next();
  } catch (error) {
    console.error("Error in validateToken middleware:", error);
    return res.status(401).json({ error: "User is not authorized" });
  }
});

module.exports = validateToken;



