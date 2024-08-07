// pages/posts/index.js

import { useState, useEffect } from "react";
import router from "next/router";
import Link from "next/link";

export default function Post() {
  const [articleList, setArticleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/article`);
        const data = await response.json();
        if (data && data.data) {
          setArticleList(data.data);
        } else {
          console.error('Invalid response data format:', data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  const navigateToDetail = (id) => {
    router.push(`/posts/${id}`);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = 'id-ID'; // Atur ke bahasa Indonesia
    return date.toLocaleDateString(locale, options);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mtop-3 post-layouting post-page">
      <div className="heading-small padding-mobile">
        <h1>Trik Cantik yang Harus Diketahui oleh Para <span>beauty bestie</span></h1>
      </div>
      <div className="heading-mobile">
        <h1>Artikel dari Hib!</h1>
      </div>
      <div className="post-layouting-scroll">
        <div className="post-layout-grid-page">
          {articleList.length > 0 ? (
            articleList.map(item => (
              <div className="post-card" key={item.id}>
                <div className="post-card-img">
                  <img src={`https://prahwa.net/storage/${item.image}`} alt={item.title}/>
                </div>
                <span>{formatDate(item.date)}</span>
                <h1 onClick={() => navigateToDetail(item.id)}>{item.title}</h1>
                <p>{item.text}</p>
                <button onClick={() => navigateToDetail(item.id)}>Baca Selengkapnya</button>
              </div>
            ))
          ) : (
            <div>No articles found</div>
          )}
        </div>
      </div>
    </div>
  );
}
