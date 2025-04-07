import '../styles/Shops.css';
import { useEffect, useState } from "react";
import axios from "axios";

function Shops() {

    const [shops, setShops] = useState([]);
    const fetchShops = async () => {
        try {
            const shopListResponse = await axios.get('http://localhost:8000/shops');

            const shopList = shopListResponse.data.shops;
            // console.log("Shoplist:", shopList);

            const shopAmount = shopList.shopCount;

            if(!shopAmount < 0) return;


            const fetchShops = shopList.map((shop) => ({
                title: shop.title,
                deals: shop.deals,
                games: shop.games,
            })); 

            setShops(fetchShops);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }

    };

    useEffect(() => {
            fetchShops();
    }, []);


    return(
        <div className='shopPage-body'>
            <h1 className="shopPage-title">Shops</h1>
            <div className="shopPage-grid">
                    {shops.map((shop) => (
                        <div key={shop.title} className="shopPage-card">
                            <div className="shopPage-card-name">
                                <div>
                                    {shop.title}
                                </div>
                            </div>
                            <div className='shopPage-card-deals-games'>
                                <div className="shopPage-card-deals">
                                     <div className="shopPage-card-name-content">
                                        DEALS
                                    </div>
                                    <div className="shopPage-card-content">
                                        {shop.deals}
                                    </div>
                                </div>
                                
                                <div className="shopPage-card-games">
                                    <div className="shopPage-card-name-content">
                                        GAMES
                                    </div>
                                    <div className="shopPage-card-content">
                                        {shop.games}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Shops;