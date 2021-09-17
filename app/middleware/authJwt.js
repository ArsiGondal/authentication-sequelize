const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models/index');
const User = db.user;

verifyToken = (req,res,next) => {
    let token = req.headers['x-access-token'];
    if(!token){
        return res.status(403).send({
            message : 'No token provided!'
        });
    }

    jwt.verify(token , config.secret , (err , decoded) => {
        if(err){
            return res.status(401).send({
                message : 'Unauthorized!'
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isAdmin = async (req,res,next) => {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for(let i=0;i<roles.length;i++){
        if(roles[i].name === 'admin'){
            next();
            return;
        }
    }

    res.status(403).send({
        message : 'Require admin role'
    });
    return;
}

isModerator = async (req,res,next) => {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for(let i=0;i<roles.length;i++){
        if(roles[i].name === 'moderator'){
            next();
            return;
        }
    }

    res.status(403).send({
        message : 'Require moderator role'
    });
    return;
}

isModeratorOrAdmin = async (req,res,next) => {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    for(let i=0;i<roles.length;i++){
        if(roles[i].name === 'admin'){
            next();
            return;
        }

        if(roles[i].name === 'moderator'){
            next();
            return;
        }
    }

    res.status(403).send({
        message : 'Require moderator or admin role'
    });
    return;
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;