import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Games.css';
function Games() {
    const [game, setGames] = useState(null);

    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'http://localhost:8000/game',

        }
        

        axios.request(options).then(function (response) {
            console.log(response.data);
            setGames(response.data)
            }).catch(function (error) {
                console.error(error)
            })

    }, [])

    const first30Games = game?.slice(0,30)

    return (
        <div className="bodyLayout">
            <h1>Games</h1>

            <div className="gamesLayout">
            {first30Games?.map((game, _index) => (
                <div key={_index} className="game">
                    {game.assets?.boxart && <img src={game.assets.boxart} alt="Game Boxart"/>}
                    <p>{game.title}</p>
                </div>))}
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