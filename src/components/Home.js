import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Home.css';

function Home() {
    const [gamesPopular, setGamesPopular] = useState([]);
    const [gamesWaitlisted, setGamesWaitlisted] = useState([]);
    const [gamesCollected, setGamesCollected] = useState([]);


    const [gamePricesPopular, setGamePricesPopular] = useState({});
    const [gamePricesWaitlisted, setGamePriceWaitlisted] = useState({});
    const [gamePricesCollected, setGamePricesCollected] = useState({});


    const fetchGames = async () => {
        try {
            const gamePopularListResponse = await axios.get("http://localhost:8000/gamePopular");
            const gamesPopular = gamePopularListResponse.data;

            const gameWaitlistedListResponse = await axios.get("http://localhost:8000/gameWaitlisted");
            const gamesWaitlisted = gameWaitlistedListResponse.data;

            const gameCollectedListResponse = await axios.get("http://localhost:8000/gameCollected");
            const gamesCollected = gameCollectedListResponse.data;


            const itadIDsPopular = gamesPopular.map(game => game.itadID);
            const itadIDsWaitlisted = gamesWaitlisted.map(game => game.itadID);
            const itadIDsCollected = gamesCollected.map(game => game.itadID);

            const popularGamesResponse = await axios.post("http://localhost:8000/gameInfo", {
                itadIDs: itadIDsPopular,
                imageType: "banner400", 
            });
            const updatedPopularGames = popularGamesResponse.data.map((game) => ({
                ...game,
                category: "popular",
            }));
    
           
            const waitlistedGamesResponse = await axios.post("http://localhost:8000/gameInfo", {
                itadIDs: itadIDsWaitlisted,
                imageType: "banner145",  
            });
            const updatedWaitlistedGames = waitlistedGamesResponse.data.map((game) => ({
                ...game,
                category: "waitlisted",
            }));
    
            
            const collectedGamesResponse = await axios.post("http://localhost:8000/gameInfo", {
                itadIDs: itadIDsCollected,
                imageType: "banner145",  
            });
            const updatedCollectedGames = collectedGamesResponse.data.map((game) => ({
                ...game,
                category: "collected",
            }));
    
            
            setGamesPopular(updatedPopularGames);
            setGamesWaitlisted(updatedWaitlistedGames);
            setGamesCollected(updatedCollectedGames);

                   
            const priceResponse = await axios.post("http://localhost:8000/game", [
                ...itadIDsPopular, 
                ...itadIDsWaitlisted, 
                ...itadIDsCollected
            ]);


            const pricesPopular = priceResponse.data.reduce((acc, curr) => {
                acc[curr.itadID] = {
                    priceRegular: curr.priceRegular,
                    priceDiscount: curr.priceDiscount,
                };
                return acc;
            }, {});
            setGamePricesPopular(pricesPopular);

            const pricesWaitlisted = priceResponse.data.reduce((acc, curr) => {
                acc[curr.itadID] = {
                    priceRegular: curr.priceRegular,
                    priceDiscount: curr.priceDiscount,
                };
                return acc;
            }, {});
            setGamePriceWaitlisted(pricesWaitlisted);

            const pricesCollected = priceResponse.data.reduce((acc, curr) => {
                acc[curr.itadID] = {
                    priceRegular: curr.priceRegular,
                    priceDiscount: curr.priceDiscount,
                };
                return acc;
            }, {});
            setGamePricesCollected(pricesCollected);

    
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    const uniquePopularGames = [...new Set(gamesPopular.map(game => game.itadID))]
        .map(itadID => gamesPopular.find(game => game.itadID === itadID));

    const uniqueWaitlistedGames = [...new Set(gamesWaitlisted.map(game => game.itadID))]
        .map(itadID => gamesWaitlisted.find(game => game.itadID === itadID));

    const uniqueCollectedGames = [...new Set(gamesCollected.map(game => game.itadID))]
        .map(itadID => gamesCollected.find(game => game.itadID === itadID));

    return (
        <div className="homePage-body">

            <div className="homePage-buttonSearch">
                <button>
                    Search
                </button>
            </div>

            <h1 className="homePage-title">Most Popular</h1>
            <div className="homePage-popular-grid">
                {uniquePopularGames.map((game, index) => (
                    <div key={`game-${game.itadID}-${index}`} className="homePage-popular-card">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="homePage-popular-cardContent">
                            <div className="homePage-popular-name" data-name={game.name}>
                                <span>{game.name}</span>
                            </div>
                            <div className="homePage-popular-price">
                                <div>
                                    <span>{gamePricesPopular[game.itadID]?.priceRegular}</span>
                                </div>
                                <div>
                                    <span>{gamePricesPopular[game.itadID]?.priceDiscount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="homePage-waitlisted-collected-grid">
                <div className="homePage-waitlisted">
                    <h1 className="homePage-title">Most Waitlisted</h1>
                    {uniqueWaitlistedGames.map((game) => (
                        <div key={`waitlisted-${game.itadID}`} className="homePage-waitlisted-card">
                            {game.image && <img src={game.image} alt={game.name} />}
                            <div className="homePage-waitlisted-cardContent">
                                <div className="homePage-waitlisted-name" data-name={game.name}>
                                    <span>{game.name}</span>
                                </div>
                                <div className="homePage-waitlisted-price">
                                    <div>
                                        <span>{gamePricesWaitlisted[game.itadID]?.priceRegular}</span>
                                    </div>
                                    <div>
                                        <span>{gamePricesWaitlisted[game.itadID]?.priceDiscount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="homePage-collected">
                    <h1 className="homePage-title">Most Collected</h1>
                    {uniqueCollectedGames.map((game) => (
                        <div key={`collected-${game.itadID}`} className="homePage-collected-card">
                            {game.image && <img src={game.image} alt={game.name} />}
                            <div className="homePage-collected-cardContent">
                                <div className="homePage-collected-name" data-name={game.name}>
                                    <span>{game.name}</span>
                                </div>
                                <div className="homePage-collected-price">
                                    <div>
                                        <span>{gamePricesCollected[game.itadID]?.priceRegular}</span>
                                    </div>
                                    <div>
                                        <span>{gamePricesCollected[game.itadID]?.priceDiscount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
}

export default Home;