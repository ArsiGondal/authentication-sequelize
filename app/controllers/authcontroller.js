const db = require('../models/index');
const config = require('../config/auth.config');
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = async(req,res) =>{
    try{
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        });
        if(user){
            if(req.body.roles){
                const roles = await Role.findAll({
                    where : {
                        name : {
                            [Op.or] : req.body.roles
                        }
                    }
                });
                await user.setRoles(roles);
                res.send({
                    message : 'User was registered successfully!'
                });
            }
            else{
                await user.setRoles([1]);
                res.send({
                    message : 'User was registered successfully!'
                });
            }
        }
    }
    catch(error){
        res.status(500).send({ message: error.message });
    }
}

exports.signin = async (req,res) => {
    try{
        const user = await User.findOne({
            where : {
                username : req.body.username
            }
        });
        
        if(!user){
            return res.status(404).send({ message: "User Not found." });
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if(!passwordIsValid){
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        var token =jwt.sign({id:user.id} , config.secret , {
            expiresIn : 86400
        });
        var authorities = [];
        const roles = await user.getRoles();
        for(let i=0;i<roles.length;i++){
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.cookie('jwt', token, {
            expires: new Date(
              Date.now() + 86400
            ),
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
          });

        res.status(200).send({
            id : user.id,
            username : user.username,
            email : user.email,
            roles : authorities,
            accessToken : token
        });
    }
    catch(error){
        res.status(500).send({ message: error.message });
    }
}