// pages/posts/index.js

import { useState, useEffect } from "react";
import router from "next/router";
import Link from "next/link";

export default function Post({ limit }) {
  const [articles, setArticles] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/article`);
        const data = await response.json();
        if (data && data.data) { // Pastikan data dan data.data ada
          setArticles(data.data); // Setel data objek banner
        } else {
          console.error('Invalid response data format:', data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchData();
  }, []);

  console.log(articles)

  const limitedArticles = limit ? articles.slice(0, limit) : articles;

  // Fungsi untuk menavigasi ke halaman detail postingan
  const navigateToDetail = (id) => {
    router.push(`/posts/${id}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = 'id-ID'; // Atur ke bahasa Indonesia
    return date.toLocaleDateString(locale, options);
  };

  return (
    <div className="mtop-3 post-layouting">
      <div className="heading-small padding-mobile">
        <h1>Trik Cantik yang Harus Diketahui oleh Para <span>beauty bestie</span></h1>
      </div>
      <div className="heading-mobile">
        <h1>Artikel dari Hib!</h1>
        <Link href="/artikel">
        <span>Lihat Semua</span>
        </Link>
      </div>
      <div className="post-layouting-scroll">
        <div className="post-layout-grid">
          {limitedArticles.map(item => (
            <div className="post-card" key={item.id}>
              <div className="post-card-img">
                <img src={`https://prahwa.net/storage/${item.image}`} alt={item.title}/>
              </div>
              <span>{formatDate(item.date)}</span>
              <h1 onClick={() => navigateToDetail(item.id)}>{item.title}</h1>
              <p>{item.text}</p>
              <button onClick={() => navigateToDetail(item.id)}>Baca Selengkapnya</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export getStaticProps here
export async function getStaticProps() {
  // Fetch data for the component
  try {
    const response = await fetch(`${baseUrl}/article`);
    const data = await response.json();
    if (data && data.data) { // Pastikan data dan data.data ada
      return {
        props: {
          articles: data.data
        }
      };
    } else {
      console.error('Invalid response data format:', data);
      return {
        props: {
          articles: []
        }
      };
    }
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      props: {
        articles: []
      }
    };
  }
}
