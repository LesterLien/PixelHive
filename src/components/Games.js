import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Games.css';
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";


function Games() {
    const [games, setGames] = useState([]);
    const [gamePrices, setGamePrices] = useState({});
    const [lastAppid, setLastAppid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingItad, setLoadingItad] = useState(false);
    const [loadingGameInfo, setLoadingGameInfo] = useState(false);

    const fetchGames = async (append = false) => {
        if (loadingItad || loadingGameInfo) return; 

        setLoading(true);
        setLoadingItad(true); 

        try {
            const gameItadResponse = await axios.get("http://localhost:8000/gameItad", {
                params: {
                    last_appid: append && lastAppid ? lastAppid : 0,
                },
            });

            const { games: newGames, lastAppid: newLastAppid } = gameItadResponse.data;

            const itadIDs = newGames.map(game => game.itadID);
            if (!itadIDs.length) return;

            setLoadingGameInfo(true); 

            const gameInfoResponse = await axios.post("http://localhost:8000/gameInfo", { 
                itadIDs,
                imageType: "boxart",
            });

            const fetchedGames = gameInfoResponse.data.map((game, index) => ({
                ...game,
                appid: newGames[index].appid,
            }));

            setGames(prev => append ? [...prev, ...fetchedGames] : fetchedGames);
            setLastAppid(newLastAppid);

            const priceResponse = await axios.post("http://localhost:8000/gamePrice", itadIDs);
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
        } finally {
            setLoadingItad(false);  
            setLoadingGameInfo(false);  
            setLoading(false); 
        }
    };

    const toggleFavorite = (itadID) => {
        setGames(prevGames => 
            prevGames.map(game => 
                game.itadID === itadID 
                    ? { ...game, favoriteStatus: !game.favoriteStatus } 
                    : game
            )
        );

        // try {
        //     const response = await axios.post('http://localhost:8000/favorite', {
        //         user_id,
        //         game_id: game.itadID, 
        //     });

        // } catch (error) {
        //     console.error("Error favoriting games:", error);
        // }
    };


    useEffect(() => {
        fetchGames();
    }, []); 

    return (
        <div className="gamesPage-body">
            <h1 className="gamesPage-title">Games</h1>
            <div className="gamesPage-grid">
                {games.map((game) => (
                    <div key={game.itadID} className="gamesPage-card">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="gamesPage-cardContent">
                            <div className="gamesPage-name" data-name={game.name}>
                                <span>{game.name}</span>
                            </div>
                            <div className="gamesPage-price-container">
                                <div className="gamesPage-price">
                                    <div>
                                        <span>{gamePrices[game.itadID]?.priceRegular}</span>
                                    </div>
                                    <div>
                                        <span>{gamePrices[game.itadID]?.priceDiscount}</span>        
                                    </div>
                                </div>
                                <div className="gamesPage-favorite" onClick={() => toggleFavorite(game.itadID)}>
                                    {game.favoriteStatus ? <AiFillHeart className='icon' /> : <AiOutlineHeart className='icon' />}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="gamesPage-buttonLoad">
                <button onClick={() => fetchGames(true)} disabled={loading || loadingItad || loadingGameInfo}>
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            </div>
        </div>
    );
}

export default Games;