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

app.get('/game', async (req, res) => {
    try {
        const gameListResponse = await axios.get('https://api.steampowered.com/IStoreService/GetAppList/v1/', {
            params: {
                include_games: true,
                include_dlc: false,
                key: process.env.REACT_APP_STEAM_API_KEY,
                max_results: 15,
            }
        });

        const games = gameListResponse.data.response.apps || [];

        const first30Games = games.slice(0, 15);

        const gameDataPromises = first30Games.map(async (game) => {
            try {
                const detailsResponse = await axios.get('https://store.steampowered.com/api/appdetails', {
                    params: {
                        appids: game.appid,
                        cc: 'us',
                    }
                });
                const gameDetails = detailsResponse.data[game.appid];

                return {
                    appid: game.appid,
                    name: game.name,
                    header_image: gameDetails?.data?.header_image || null,
                    final_price: gameDetails?.data?.price_overview?.final_formatted || "Free",

                };
            } catch (error) {
                console.error(`Error fetching details for appid ${game.appid}`, error);
                return { appid: game.appid, name: game.name, header_image: null , final_price: "Free"};
            }
        });

        const gameData = await Promise.all(gameDataPromises);

        res.json(gameData);
    } catch (error) {
        console.error('Error fetching game list:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});



app.listen(PORT, () => console.log(`Server is running on ${PORT}`))



