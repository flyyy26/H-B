import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules';

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
        <Swiper 
            spaceBetween={30} 
            slidesPerView={7} 
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }} 
            modules={[Autoplay]}
            className="mySwiper">
            {brands.map(brand => (// perubahan pada penulisan kurung kurawal
            <SwiperSlide>
                <div className="merk-box" key={brand.id}>
                    <a href={`/catalog-product/search/${brand.name}`}>
                        <img src={`https://prahwa.net/storage/${brand.logo}`} alt={brand.name}/>
                    </a>
                </div>
                </SwiperSlide>
            ))}
            </Swiper>
         </div>
    );
}
