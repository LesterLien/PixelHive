import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Favorites.css';
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";


function Favorites() {
    const [games, setGames] = useState([]);
    const [gamePrices, setGamePrices] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingItad, setLoadingItad] = useState(false);
    const [loadingGameInfo, setLoadingGameInfo] = useState(false);

    const fetchFavoriteGames = async () => {
        if (loadingItad || loadingGameInfo) return; 

        setLoading(true);
        setLoadingItad(true); 

        try {
            const accessToken = localStorage.getItem('accessToken');
            const user_id = localStorage.getItem('userId');
            
            if (!accessToken && !user_id) return;

            const gameFavoritesResponse = await axios.get(`http://localhost:8000/favorites/${user_id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const itadIDs = gameFavoritesResponse.data.favorites;


            setLoadingGameInfo(true); 

            const gameInfoResponse = await axios.post("http://localhost:8000/gameInfo", { 
                itadIDs,
                imageType: "boxart",
            });

            const fetchedGames = gameInfoResponse.data.map((game) => ({
                ...game,
            }));

            setGames(fetchedGames);

            const priceResponse = await axios.post("http://localhost:8000/gamePrice", itadIDs);
            const prices = priceResponse.data.reduce((acc, curr) => {
                acc[curr.itadID] = {
                    priceRegular: curr.priceRegular,
                    priceDiscount: curr.priceDiscount,
                };
                return acc;
            }, {});
            setGamePrices(prices);

        } catch (error) {
            console.error("Error fetching games:", error);
        } finally {
            setLoadingItad(false);  
            setLoadingGameInfo(false);  
            setLoading(false); 
        }
    };
    


    useEffect(() => {
        fetchFavoriteGames();
    }, []); 

    return (
        <div className="favoritesPage-body">
            <h1 className="favoritesPage-title">Favorites</h1>
            <div className="favoritesPage-grid">
                {games.map((game) => (
                    <div key={game.itadID} className="favoritesPage-card">
                        {game.image && <img src={game.image} alt={game.name} />}
                        <div className="favoritesPage-cardContent">
                            <div className="favoritesPage-name" data-name={game.name}>
                                <span>{game.name}</span>
                            </div>
                            <div className="favoritesPage-price-container">
                                <div className="favoritesPage-price">
                                    <div>
                                        <span>{gamePrices[game.itadID]?.priceRegular}</span>
                                    </div>
                                    <div>
                                        <span>{gamePrices[game.itadID]?.priceDiscount}</span>        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;