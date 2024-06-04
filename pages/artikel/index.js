// pages/posts/index.js

import { useState, useEffect } from "react";
import router from "next/router";

export default function Artikel() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://103.153.43.25/api/article');
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

  // Fungsi untuk menavigasi ke halaman detail postingan
  const navigateToDetail = (id) => {
    router.push(`/artikel/${id}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = 'id-ID'; // Atur ke bahasa Indonesia
    return date.toLocaleDateString(locale, options);
  };

  return (
    <div className="artikel-layouting">
      <div className="post-layouting-scroll">
        <div className="artikel-layout-grid">
          {articles.map(item => (
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
    const response = await fetch('http://103.153.43.25/api/article');
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
