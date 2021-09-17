const config = require('../config/db.config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.DB , config.USER , config.PASSWORD , {
    host : config.HOST,
    dialect : config.dialect,
    logging : false,
    pool : {
        max : config.pool.max,
        min : config.pool.min,
        acquire : config.pool.acquire,
        idle : config.pool.idle
    }
})

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require('./user')(sequelize , Sequelize);
db.role = require('./role')(sequelize,Sequelize);

db.role.belongsToMany(db.user , {
    through : 'user_roles',
    foreignKey : 'roleId',
    otherKey : 'userId'
});

db.user.belongsToMany(db.role , {
    through : 'user_roles',
    foreignKey : 'userId',
    otherKey : 'roleId'
});

db.ROLES = ['admin' , 'moderator' , 'user'];

module.exports = db;