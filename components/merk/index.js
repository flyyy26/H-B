import { useEffect, useState } from "react";

export default function Merk(){
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/brands');
            const data = await response.json();
            if (data && data.data) { // Pastikan data dan data.data ada
            setBrands(data.data); // Setel data objek banner
            } else {
            console.error('Invalid response data format:', data);
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
        };
 
        fetchData();
    }, []);

    return(
        <div className="merk-layout"> 
            {brands.map(brand => (// perubahan pada penulisan kurung kurawal
                <div className="merk-box" key={brand.id}>
                    <a href={`/catalog-product/search/${brand.name}`}>
                        <img src={`https://prahwa.net/storage/${brand.logo}`} alt={brand.name}/>
                    </a>
                </div>
            ))}
        </div>
    );
}
