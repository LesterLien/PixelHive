import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Home.css';

function Home() {
    const [games, setGames] = useState([]);
    const [gamePrices, setGamePrices] = useState({});
    const fetchPopularGames = async () => {
        try {
            const gamePopularListResponse = await axios.get("http://localhost:8000/gamePopular");
            const games = gamePopularListResponse.data;

            const itadIDs = games.map(game => game.itadID);

            if (!itadIDs.length) return;

            const gameInfoResponse = await axios.post("http://localhost:8000/gameInfo", { 
                itadIDs,
                imageType: "banner400",
            });

    
            const fetchedGames = gameInfoResponse.data.map((game) => ({
                ...game,
            }));

            setGames(fetchedGames);
            const priceResponse = await axios.post("http://localhost:8000/game", itadIDs);
            const prices = priceResponse.data.reduce((acc, curr) => {
                acc[curr.itadID] = {
                    priceRegular: curr.priceRegular,
                    priceDiscount: curr.priceDiscount,
                };
                return acc;
            }, {});
            setGamePrices(prev => ({ ...prev, ...prices }));

    
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    useEffect(() => {
        fetchPopularGames();
    }, []);

    return (
        <div className="homePage-body">
            <div className="homePage-buttonSearch">
                <button>
                    Search
                </button>
            </div>
            <h1 className="homePage-title">Most Popular</h1>
            <div className="homePage-grid">
                {games.map((game) => (
                    <div key={game.itadID} className="homePage-card">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="homePage-cardContent">
                            <div className="homePage-name" data-name={game.name}>
                                <span>{game.name}</span>
                            </div>
                            <div className="homePage-price">
                                <div>
                                    <span>
                                        {gamePrices[game.itadID]?.priceRegular}
                                    </span>
                                </div>
                                <div>
                                    <span>
                                        {gamePrices[game.itadID]?.priceDiscount} 
                                    </span>        
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;