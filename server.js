const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models/index');

const Role = db.role;

const app = express();

const corsOptions = {
    origin : "http://localhost:3000"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

require('./app/routes/authRoutes')(app);
require('./app/routes/userRoutes')(app);

app.get('/' , (req,res) => {
    res.json({
        message : 'Welcome to Authentication and Authorization'
    })
})

db.sequelize.sync().then(() => {
    console.log('Connected to database');
    // initial();
})

// function initial(){
//     Role.create({
//         id:1,
//         name: 'user'
//     });

//     Role.create({
//         id:2,
//         name: 'admin'
//     });

//     Role.create({
//         id:3,
//         name: 'moderator'
//     });
// }

const PORT = process.env.PORT || 3000;

app.listen(PORT , () =>{
    console.log(`Server running on http://localhost:${PORT}`);
})
