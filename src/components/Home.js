import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Home.css';

function Home() {
    const [gamesPopular, setGamesPopular] = useState([]);
    const [gamesWaitlisted, setGamesWaitlisted] = useState([]);
    const [gamesCollected, setGamesCollected] = useState([]);
    const [gamesTrending, setGamesTrending] = useState([]);

    const [gamePrices, setGamePrices] = useState({});


    const fetchGames = async () => {
        try {
            const [gamePopularListResponse, gameWaitlistedListResponse, gameCollectedListResponse, gameTrendingListReponse] = await Promise.all([
                axios.get("http://localhost:8000/gamePopular"),
                axios.get("http://localhost:8000/gameWaitlisted"),
                axios.get("http://localhost:8000/gameCollected"),
                axios.get("http://localhost:8000/gameTrending")
            ]);

            const gamesPopular = gamePopularListResponse.data;
            const gamesWaitlisted = gameWaitlistedListResponse.data;
            const gamesCollected = gameCollectedListResponse.data;
            const gamesTrending = gameTrendingListReponse.data;

            const itadIDsPopular = gamesPopular.map(game => game.itadID);
            const itadIDsWaitlisted = gamesWaitlisted.map(game => game.itadID);
            const itadIDsCollected = gamesCollected.map(game => game.itadID);
            const itadIDsTrending = gamesTrending.map(game => game.itadID);

            const [popularGamesResponse, waitlistedGamesResponse, collectedGamesResponse, trendingGamesResponse] = await Promise.all([
                axios.post("http://localhost:8000/gameInfo", { itadIDs: itadIDsPopular, imageType: "banner400" }),
                axios.post("http://localhost:8000/gameInfo", { itadIDs: itadIDsWaitlisted, imageType: "banner145" }),
                axios.post("http://localhost:8000/gameInfo", { itadIDs: itadIDsCollected, imageType: "banner145" }),
                axios.post("http://localhost:8000/gameInfo", { itadIDs: itadIDsTrending, imageType: "banner400" })
            ]);

            const updatedPopularGames = popularGamesResponse.data.map((game) => ({ ...game, category: "popular" }));
            const updatedWaitlistedGames = waitlistedGamesResponse.data.map((game) => ({ ...game, category: "waitlisted" }));
            const updatedCollectedGames = collectedGamesResponse.data.map((game) => ({ ...game, category: "collected" }));
            const updatedTrendingGames = trendingGamesResponse.data.map((game) => ({ ...game, category: "trending" }));

            setGamesPopular(updatedPopularGames);
            setGamesWaitlisted(updatedWaitlistedGames);
            setGamesCollected(updatedCollectedGames);
            setGamesTrending(updatedTrendingGames);

            const priceResponse = await axios.post("http://localhost:8000/gamePrice", [
                ...itadIDsPopular, 
                ...itadIDsWaitlisted, 
                ...itadIDsCollected,
                ...itadIDsTrending
            ]);

            const prices = priceResponse.data.reduce((acc, curr) => {
                acc[curr.itadID] = {
                    priceRegular: curr.priceRegular,
                    priceDiscount: curr.priceDiscount
                };
                return acc;
            }, {});

            setGamePrices(prices);

        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const getUniqueGames = (games) => {
        return [...new Set(games.map(game => game.itadID))]
            .map(itadID => games.find(game => game.itadID === itadID));
    };

    const uniquePopularGames = getUniqueGames(gamesPopular);
    const uniqueWaitlistedGames = getUniqueGames(gamesWaitlisted);
    const uniqueCollectedGames = getUniqueGames(gamesCollected);
    const uniqueTrendingGames = getUniqueGames(gamesTrending);

    return (
        <div className="homePage-body">
            <div className="homePage-buttonSearch">
                <button>Search</button>
            </div>

            <h1 className="homePage-title">Trending</h1>
            <div className="homePage-popular-trending-grid">
                {uniqueTrendingGames.map((game, index) => (
                    <div key={`game-${game.itadID}-${index}`} className="homePage-popular-trending-card">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="homePage-popular-trending-cardContent">
                            <div className="homePage-popular-trending-name" data-name={game.name}>
                                <span>{game.name}</span>
                            </div>
                            <div className="homePage-popular-trending-price">
                                <div><span>{gamePrices[game.itadID]?.priceRegular}</span></div>
                                <div><span>{gamePrices[game.itadID]?.priceDiscount}</span></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="homePage-waitlisted-collected-grid">
                <div className="homePage-waitlisted-collected">
                    <h1 className="homePage-title">Most Waitlisted</h1>
                    {uniqueWaitlistedGames.map((game) => (
                        <div key={`waitlisted-${game.itadID}`} className="homePage-waitlisted-collected-card">
                            {game.image && <img src={game.image} alt={game.name} />}
                            <div className="homePage-waitlisted-collected-cardContent">
                                <div className="homePage-waitlisted-collected-name" data-name={game.name}>
                                    <span>{game.name}</span>
                                </div>
                                <div className="homePage-waitlisted-collected-price">
                                    <div><span>{gamePrices[game.itadID]?.priceRegular}</span></div>
                                    <div><span>{gamePrices[game.itadID]?.priceDiscount}</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="homePage-waitlisted-collected">
                    <h1 className="homePage-title">Most Collected</h1>
                    {uniqueCollectedGames.map((game) => (
                        <div key={`collected-${game.itadID}`} className="homePage-waitlisted-collected-card">
                            {game.image && <img src={game.image} alt={game.name} />}
                            <div className="homePage-waitlisted-collected-cardContent">
                                <div className="homePage-waitlisted-collected-name" data-name={game.name}>
                                    <span>{game.name}</span>
                                </div>
                                <div className="homePage-waitlisted-collected-price">
                                    <div><span>{gamePrices[game.itadID]?.priceRegular}</span></div>
                                    <div><span>{gamePrices[game.itadID]?.priceDiscount}</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <h1 className="homePage-title">Most Popular</h1>
            <div className="homePage-popular-trending-grid">
                {uniquePopularGames.map((game, index) => (
                    <div key={`game-${game.itadID}-${index}`} className="homePage-popular-trending-card">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="homePage-popular-trending-cardContent">
                            <div className="homePage-popular-trending-name" data-name={game.name}>
                                <span>{game.name}</span>
                            </div>
                            <div className="homePage-popular-trending-price">
                                <div><span>{gamePrices[game.itadID]?.priceRegular}</span></div>
                                <div><span>{gamePrices[game.itadID]?.priceDiscount}</span></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
