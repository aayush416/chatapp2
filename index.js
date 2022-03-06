const express = require('express')
const app = express();
const PORT = 4000 || process.env.port;
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: '*' } });
const mongoose = require('mongoose');
const Cors = require('cors')
const bodyParser = require('body-parser')
const User = require('./models/user.js');
app.use(express.urlencoded({ extended: true })); 
let alert = require('alert');

let user_name = "user";
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.use(express.static('./login'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(Cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const connectionurl = 'mongodb+srv://Aayush:Aayush01744@cluster0.v8k8n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(connectionurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

io.on('connection', (socket) => {
    socket.on('message', (data) => {
        socket.broadcast.emit('message', data);
    })
});


app.get('/', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat.ejs', { name: user_name })
})


app.get('/signup', (req, res) => {
    res.render("signup")
});

app.post("/signin", async (req, res) => {
    const { useremail, userpassword } = req.body;
    try {
        const userLogin = await User.findOne({ useremail: useremail });

        if (userLogin) {
            const isMatch = userLogin.userpassword === userpassword;

            if (!isMatch) {
                alert("INVALID CREDENTIAL")
                return res.redirect('/');
            } else {
                user_name = userLogin.username;
                return res.redirect('/chat');
            }
        } else {
            alert("INVALID CREDENTIAL");
        }
    } catch (err) {
        alert(err)
        return res.redirect('/');
    }
});

app.post("/signup", async (req, res) => {
    const { username, useremail, userpassword } = req.body;

    try {
        const userExist = await User.findOne({ useremail: useremail });
        if (userExist) {
            alert("USER ALREADY EXISTS")
            return res.redirect('/signup');
        }

        const user = new User({ username, useremail, userpassword });

        const userRegister = await user.save();
        if (userRegister) {
            alert("USER REGISTERED SUCCESSFULLY")
            return res.redirect('/');
        }
    } catch (err) {
        console.log(err);
    }
});
server.listen(PORT, () => {
    console.log(`Server running ${PORT}`);
})