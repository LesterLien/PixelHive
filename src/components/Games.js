import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Games.css';
function Games() {
    const [games, setGames] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/game")
            .then((response) => {
                setGames(response.data);
            })
            .catch((error) => {
                console.error("Error fetching games:", error);
            });
    }, []);

    return (
        <div className="bodyLayout">
            <h1>Games</h1>

            <div className="gamesLayout">
                {games.map((game) => (
                    <div key={game.appid} className="game">
                        {game.header_image && <img src={game.header_image} alt={game.name} />}
                        <p>{game.name}</p>
                        <p>{game.final_price}</p>
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