// components/LoadingBar.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const LoadingBar = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prevProgress + 5;
        });
      }, 300);
    };

    const stopLoading = () => {
      setLoading(false);
      setProgress(100);
      setTimeout(() => {
        setProgress(0);
      }, 500); // Reset progress setelah 500ms untuk menghindari transisi langsung kembali ke awal
    };

    router.events.on('routeChangeStart', startLoading);
    router.events.on('routeChangeComplete', stopLoading);
    router.events.on('routeChangeError', stopLoading);

    return () => {
      router.events.off('routeChangeStart', startLoading);
      router.events.off('routeChangeComplete', stopLoading);
      router.events.off('routeChangeError', stopLoading);
    };
  }, []);

  return loading ? (
    <div className='loading-bar' style={{ width: `${progress}%` }} /> // Gunakan gaya dari file CSS
  ) : null;
};

export default LoadingBar;
