const jwt = require('jsonwebtoken')

const authMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message: 'Token Missing'});
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded){
        if(err){
            return res.status(401).json({message:'Invalid token'})
        }
        req.user = decoded;
        next();
    } );
}
module.exports = authMiddleware
