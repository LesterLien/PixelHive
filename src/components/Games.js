import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Games.css';

function Games() {
    const [games, setGames] = useState([]);
    const [gamePrices, setGamePrices] = useState({});

    useEffect(() => {
        axios.get("http://localhost:8000/gameItad")
            .then((response) => {
                const itadIDs = response.data;

                if (!itadIDs.length) return;

                axios.post("http://localhost:8000/gameInfo", { itadIDs })
                    .then((gameResponse) => {
                        const fetchedGames = gameResponse.data;
                        setGames(fetchedGames);


                        const itadIDsForPrices = fetchedGames.map(game => game.itadID).filter(id => id);

                        if (itadIDsForPrices.length > 0) {
                            
                            axios.post("http://localhost:8000/game", itadIDsForPrices )
                                .then((priceResponse) => {
                                    // console.log(priceResponse);
                                    const prices = priceResponse.data.reduce((acc, curr) => {
                                        acc[curr.itadID] = {
                                            priceRegular: curr.priceRegular,
                                            priceDiscount: curr.priceDiscount,
                                        };
                                        return acc;
                                    }, {});
                                    setGamePrices(prices);
                                })
                                .catch((error) => console.error("Error fetching prices:", error));
                        }
                    })
                    .catch((error) => console.error("Error fetching game info:", error));
            })
            .catch((error) => console.error("Error fetching ITAD IDs:", error));
    }, []);

    return (
        <div className="bodyLayout">
            <h1 className="title">Games</h1>

            <div className="gamesLayout">
                {games.map((game) => (
                    <div key={game.itadID} className="game">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="content">
                            <div className="name" data-name={game.name}>
                                    <span>{game.name}</span>
                            </div>
                            <div className="price">
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
            <div className="buttonLoad">
                <button>
                    Load More
                </button>
            </div>
        </div>
    );
}

export default Games;