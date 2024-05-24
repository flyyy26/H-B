import React, { useRef,useEffect, useState } from 'react';
import Image from 'next/image';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import BgBestSeller from "@/public/images/bg-best-seller.png"

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay,Pagination } from 'swiper/modules';


const BestSeller = () => {
  // State untuk menyimpan data produk dengan rating
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        const response = await fetch('/api/bestSeller');
        const data = await response.json();
        setBestSeller(data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchBestSeller();
  }, []);

  return (
    <div className='best-seller-layout'>
      <Image src={BgBestSeller} alt='Best Seller Hallo Beauty' className='bg-best-seller' />
      <Swiper 
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay,Pagination]}
          pagination={{
            clickable:true,
          }} 
          className="slideBestSeller">
                {bestSeller.map(product => (
                    <SwiperSlide key={product.posVarianId}>
                        <div className="best-seller-box">
                            <div className='best-seller-image'>
                              <img src={`https://api.upos-conn.com/master/v1/${product.gambar}`} alt={product.namaVarian}/>
                            </div>
                            <h3>{product.namaVarian}</h3>
                        </div>
                    </SwiperSlide>
                ))}
        </Swiper>
    </div>
  );
};

export default BestSeller;
