import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://103.153.43.25/api/article/${router.query.id}`);
        const data = await response.json();
        setPost(data.data); // Perhatikan bahwa data yang ingin Anda tampilkan berada di dalam properti "data"
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (router.query.id) {
      fetchPost();
    }
  }, [router.query.id]);

  // Tampilkan loading jika data masih diambil atau jika id tidak ada
  if (!post || !router.query.id) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container-small single-post'>
      <h1>{post.title}</h1>
      <img src={`https://prahwa.net/storage/${post.image}`} alt={post.title} />
      <p>{post.text}</p>
      <p>Hai</p>
    </div>
  );
};

export default PostDetail;
