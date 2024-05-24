import React from 'react';
import Slider from "react-slick";
import Link from 'next/link';

function customDots(i) {
    return <button style={{ width: "10px", height: "10px", borderRadius: "50%" }}>Page {i + 1}</button>;
  }

const PopupWelcome = ({ onClose }) => {
    const settingsSecondSlider = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2500,
        loop: false,
        fade: false,
        navigation: false,
        nextArrow: false,
        prevArrow: false,
        customPaging: i => customDots(i)
      };
  return (
    <div className="popup-overlay-front">
      <div className="popup-content-front">
        <Slider {...settingsSecondSlider}>
            <div className='slide-front slide-front-1'>
                <img src='images/slide-front-1.png' alt='H!bi'/>
                <h1>Temukan semua kebutuhan cantikmu hanya di H!bi</h1>
                <p>Mulailah perjalanan kecantikanmu hari ini dan jelajahi semua yang ditawarkan H!bi.</p>
            </div>
            <div className='slide-front slide-front-2'>
                <img src='images/slide-front-2.png' alt='H!bi'/> 
                <h1>Order Sekarang!</h1>
                <p>H!bi menjamin proses yang aman dan efisien, memastikan bahwa setiap transaksi kamu berjalan lancar.</p>
            </div>
            <div className='slide-front slide-front-3'>
                    <img src='images/slide-front-3.png' alt='H!bi'/> 
                    <h1>Pengantaran Cepat</h1>
                <p>Tak lagi ada kekhawatiran tentang penantian panjang atau keterlambatan yang merusak rencana kamu.</p>
                <Link href="/masuk" onClick={onClose}><button>Mulai Sekarang</button></Link>
            </div>
          </Slider>
      </div>
    </div>
  );
};

export default PopupWelcome;