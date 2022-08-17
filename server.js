const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { default: axios } = require('axios');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: false}));
const port = 5000;

app.get('/', function(req, res){
    res.status(200).render('index');
});

app.get('/repos', async(req, res) => {
    const username = req.query.username || 'WesleyJak';
    try {
        const result = await axios.get(
            `https://api.github.com/users/${username}/repos`
        );
        const repos = result.data.map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
        }));
        res.render("repos", {
            repos
        });
    } catch (error) {
        console.log(error)
        res.status(400).send("Error while getting the repo list!");
    }
});

app.post('/login', (req, res) => {
    const {name, password} = req.body;

    if(name === 'admin' && password === 'admin'){
        res.render('success', {
            username: name,
        });
    } else {
        res.render('failure');
    }
});

app.listen(port, function () {
    console.log(`Started app on port ${port}`);
});