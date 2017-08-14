const express = require('express');
const app = express();
const axios = require('axios')
const util = require('util')
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`server is listening on ${port}`));

app.get('/', (req, res) => {
    axios({
        url: `http://192.168.0.50/`,
        method: 'GET'
    })
    .then(data => res.send('Arduino says: pin powered'))
    .catch(bug => console.log(bug))
});
