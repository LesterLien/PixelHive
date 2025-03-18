const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


const app = express();

app.use(cors())

app.get('/', (req,res) => {
    res.json('template')
})

app.get('/game', (req,res) => {
    const options = {
        method: 'GET',
        url: 'https://api.isthereanydeal.com/games/search/v1',
        params: {
            title: '',
            results: 30,
            key: process.env.REACT_APP_API_KEY,
        }

    }
    

    axios.request(options).then(function (response) {
        res.json(response.data);
        }).catch(function (error) {
            console.error(error)
        })
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))