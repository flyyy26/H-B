import { useState, useEffect } from 'react';
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/effect-fade';

// import { Swiper, SwiperSlide } from "swiper/react"
// import { Navigation, Autoplay } from "swiper/modules"

import Slider from "react-slick";

// Custom Next Arrow
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    />
  );
}

// Custom Previous Arrow
function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    />
  );
}

function customDots(i) {
  return <button style={{ width: "10px", height: "10px", borderRadius: "50%" }}>Page {i + 1}</button>;
}


const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/banner`);
        const data = await response.json();
        if (data && data.data) { // Pastikan data dan data.data ada
          setBanners(data.data); // Setel data objek banner
        } else {
          console.error('Invalid response data format:', data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchData();
  }, []);

  console.log(banners)

  const settingsFirstSlider = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    loop: true,
    fade: true,
    navigation: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    
  };

  const settingsSecondSlider = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    loop: true,
    fade: true,
    navigation: false,
    nextArrow: false,
    prevArrow: false,
    customPaging: i => customDots(i)
  };

  return (
    <div>
        <div className="slider">
          <Slider {...settingsFirstSlider}>
              {banners.map(banner => (
                  <div key={banner.id}>
                      <div className="slider-box">
                          <img src={`https://prahwa.net/storage/${banner.image}`} alt={banner.type}/> 
                      </div>
                  </div>
              ))}

          </Slider>
        </div>
        <div className="slider-mobile">
          <Slider {...settingsSecondSlider}>
              {banners.map(banner => (
                  <div key={banner.id}>
                      <div className="slider-box">
                          <img src={`https://prahwa.net/storage/${banner.image}`} alt={banner.type}/> 
                      </div>
                  </div>
              ))}

          </Slider>
        </div>
    </div>
  );
};

export default BannerPage;
