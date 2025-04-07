const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json('template');
});

app.get('/gameItad', async (req, res) => {
    const {last_appid = 0} = req.query
    try {
        const gameListResponse = await axios.get('https://api.steampowered.com/IStoreService/GetAppList/v1/', {
            params: {
                include_games: true,
                include_dlc: false,
                key: process.env.REACT_APP_STEAM_API_KEY,
                max_results: 15,
                last_appid: last_appid,
            }
        });

        const games = gameListResponse.data.response.apps || [];
        if (!games.length) 
            return res.json({ games: [], lastAppid: null });
        

        const gameDataPromises = games.map(async (game) => {
            try {
                const itadLookupResponse = await axios.get('https://api.isthereanydeal.com/games/lookup/v1', {
                    params: {
                        key: process.env.REACT_APP_ITAD_API_KEY,
                        appid: game.appid, 
                    }
                });

                const itadID = itadLookupResponse.data?.game?.id;

                return {itadID, appid: game.appid };
            } catch (error) {
                console.error(`Error fetching details for appid ${game.appid}`, error);
                return null;
            }
        });

        const itadIDs = await Promise.all(gameDataPromises);
        const filteredGames = itadIDs.filter(id => id !== null);

        const nextLastGame = games[games.length - 1].appid;

        res.json({ games: filteredGames, lastAppid: nextLastGame });

    } catch (error) {
        console.error('Error fetching game list:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

app.post('/gameInfo', async (req, res) => {
    const { itadIDs, imageType } = req.body;

    if (!itadIDs || !Array.isArray(itadIDs) || itadIDs.length === 0) {
        return res.status(400).json({ error: "No ITAD IDs provided" });
    }

    try {
        const gameInfoPromises = itadIDs.map(async (itadID) => {
            try {
                const gameInfoResponse = await axios.get('https://api.isthereanydeal.com/games/info/v2', {
                    params: {
                        key: process.env.REACT_APP_ITAD_API_KEY,
                        id: itadID,
                    },
                });

                const gameInfo = gameInfoResponse.data;
                return {
                    itadID,
                    name: gameInfo.title,
                    image: gameInfo.assets?.[imageType] || null,
                };
            } catch (error) {
                console.error(`Error fetching info for itadID ${itadID}`, error);
                return null; 
            }
        });

        const gameInfoData = await Promise.all(gameInfoPromises);
        const validGameInfo = gameInfoData.filter(game => game !== null); 

        res.json(validGameInfo);

    } catch (error) {
        console.error("Error fetching game info:", error);
        res.status(500).json({ error: "Failed to fetch game info" });
    }
});

app.post('/gamePrice', async (req, res) => {
    const itadIDs = req.body;

    
    if (!Array.isArray(itadIDs) || itadIDs.length === 0 || !itadIDs.every(id => typeof id === 'string')) {
        return res.status(400).json({ error: "Invalid input format for array." });
    }

    try {
        const gamePriceResponse = await axios.post(
            'https://api.isthereanydeal.com/games/prices/v3',
            itadIDs, 
            {
                params: {
                    key: process.env.REACT_APP_ITAD_API_KEY,
                    country: "US",
                },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        
        if (!gamePriceResponse.data) {
    
            return res.status(404).json({ error: "No price data found for the provided game IDs" });
        }

        const priceData = gamePriceResponse.data;
     

        const formattedPrices = itadIDs.map(itadID => {
            const game = priceData.find(game => game.id === itadID);
            if (!game) {
                return {
                    itadID: itadID,
                    priceRegular: "No data",
                    priceDiscount: "No data",
                };
            }
            const deals = game.deals || [];
            const deal = deals.length > 0 ? deals[0] : null;

            const priceRegular = deal?.regular?.amount;
            const priceDiscount = deal?.price?.amount || priceRegular;


            const priceRegularFormatted = priceRegular === 0 ? "Free" : `Regular: $${priceRegular}`;
            const priceDiscountFormatted = priceDiscount === priceRegular ? "No Discount" : (priceDiscount === 0 ? "Free" : `Discount: $${priceDiscount}`);

            return {
                itadID: game.id, 
                priceRegular: priceRegularFormatted,
                priceDiscount: priceDiscountFormatted,
            };
        });

        res.json(formattedPrices);

    } catch (error) {
        console.error("Error fetching price data:", error);
        res.status(500).json({ error: "Error fetching price data" });
    }
});

app.get('/gamePopular', async (req, res) => {
    try {
        let nonMatureGames = [];
        let offset = 0;
        const batchSize = 20; 

        while (nonMatureGames.length < 8) {
            const gameListResponse = await axios.get('https://api.isthereanydeal.com/stats/most-popular/v1', {
                params: {
                    key: process.env.REACT_APP_ITAD_API_KEY,
                    limit: batchSize,
                    offset: offset,
                }
            });

            const games = gameListResponse.data || [];
            const nonMatureBatch = games.filter(game => game.mature === false && game.count > 200);

            nonMatureGames = nonMatureGames.concat(nonMatureBatch);

            offset += batchSize; 

            if (games.length < batchSize) {
                break; 
            }
        }

        if (!nonMatureGames.length) {
            return res.json({ games: [] });
        }

        const first8NonMatureGames = nonMatureGames.slice(0, 8);

        const filteredGames = first8NonMatureGames.map(game => ({
            itadID: game.id
        }));

        res.json(filteredGames );

    } catch (error) {
        console.error('Error fetching popular game list:', error);
        res.status(500).json({ error: 'Failed to fetch popular game list' });
    }
});

app.get('/gameWaitlisted', async (req, res) => {
    try {
        let nonMatureGames = [];
        let offset = 0;
        const batchSize = 20;

        while(nonMatureGames.length < 10) {
            const gameListResponse = await axios.get('https://api.isthereanydeal.com/stats/most-waitlisted/v1', {
                params: {
                    key: process.env.REACT_APP_ITAD_API_KEY,
                    limit: batchSize,
                    offset: offset,
                }
            });

            const games = gameListResponse.data || [];
            const nonMatureBatch = games.filter(game => game.mature === false && game.count > 200);

            nonMatureGames = nonMatureGames.concat(nonMatureBatch);

            offset += batchSize;

            if(games.length < batchSize) {
                break;
            }
        }

        if (!nonMatureGames.length) {
            return res.json({ games: [] });
        }

        const first10NonMatureGames = nonMatureGames.slice(0, 10);

        const filteredGames = first10NonMatureGames.map(game => ({
            itadID: game.id
        }));

        res.json(filteredGames);



    } catch (error) {
        console.error('Error fetching waitlisted game list', error);
        res.status(500).json({error: 'Failed to fetch waitlisted game list' });
    }

});

app.get('/gameCollected', async (req, res) => {
    try {
        let nonMatureGames = [];
        let offset = 0;
        const batchSize = 20;

        while(nonMatureGames.length < 10) {
            const gameListResponse = await axios.get('https://api.isthereanydeal.com/stats/most-collected/v1', {
                params: {
                    key: process.env.REACT_APP_ITAD_API_KEY,
                    limit: batchSize,
                    offset: offset,
                }
            });

            const games = gameListResponse.data || [];
            const nonMatureBatch = games.filter(game => game.mature === false && game.count > 200);

            nonMatureGames = nonMatureGames.concat(nonMatureBatch);

            offset += batchSize;

            if(games.length < batchSize) {
                break;
            }
        }

        if (!nonMatureGames.length) {
            return res.json({ games: [] });
        }

        const first10NonMatureGames = nonMatureGames.slice(0, 10);

        const filteredGames = first10NonMatureGames.map(game => ({
            itadID: game.id
        }));

        res.json(filteredGames );



    } catch (error) {
        console.error('Error fetching collected game list', error);
        res.status(500).json({error: 'Failed to fetch collected game list' });
    }

});

app.get('/gameTrending', async (req, res) => {
    try {
        const gameListResponse = await axios.get('https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/', {
            params: {
                key: process.env.REACT_APP_STEAM_API_KEY,
            }
        });

        const games = gameListResponse.data.response.ranks || [];
        if (!games.length) 
            return res.json({lastAppid: null });
        
        const first8TrendingGames = games.slice(0,8);

        const gameDataPromises = first8TrendingGames.map(async (game) => {
            try {
                const itadLookupResponse = await axios.get('https://api.isthereanydeal.com/games/lookup/v1', {
                    params: {
                        key: process.env.REACT_APP_ITAD_API_KEY,
                        appid: game.appid, 
                    }
                });

                const itadID = itadLookupResponse.data?.game?.id;

                return {itadID};
            } catch (error) {
                console.error(`Error fetching details for appid ${game.appid}`, error);
                return null;
            }
        });

        const itadIDs = await Promise.all(gameDataPromises);
        const filteredGames = itadIDs.filter(id => id !== null);

        res.json(filteredGames);

    } catch (error)
    {
        console.error('Error fetching trending game list', error);
        res.status(500).json({error: 'Failed to fetch trending game list' });
    }
});

app.get('/shops', async (req, res) => {
    const {shopCount = 0} = req.query
    try {
        const gameShopResponse = await axios.get('https://api.isthereanydeal.com/service/shops/v1', {
            params: {

                country: 'US',
            }
        });

            const shops = gameShopResponse.data;
            if (!shops.length) {
                return res.json({shops:{}, shopCount: shops.length});
            }

            
            const formattedShops = shops.map(shops => ({
                title: shops.title,
                deals: shops.deals,
                games: shops.games,

            }));
            
            res.json({shops: formattedShops, shopCount: shops.length});

    } catch (error)
    {
        console.error('Error fetching game shop deals', error);
        res.status(500).json({error: 'Failed to fetch game shop deals'});
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


