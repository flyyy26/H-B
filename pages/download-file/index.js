// import React, { useEffect } from 'react';

// const DownloadFile = () => {
//   useEffect(() => {
//     const downloadFile = () => {
//       const url = '/apk/HibStore.apk'; // Ganti dengan URL atau path file yang sesuai
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'HibStore.apk'); // Ganti dengan nama file yang diinginkan
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     };

//     downloadFile();
//   }, []);

//   return <div className='download-file-page'><h1>File sedang diunduh...</h1></div>; // Konten ini akan ditampilkan sementara file diunduh
// };

// export default DownloadFile;

import React, { useState, useEffect } from 'react';

const Download = () => {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const downloadFile = async () => {
      const url = '/apk/HibStore.apk'; // Ganti dengan URL atau path file yang sesuai
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'HibStore.apk'); // Ganti dengan nama file yang diinginkan
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Tunggu beberapa saat untuk simulasi proses unduh
      await new Promise(resolve => setTimeout(resolve, 2000));

      setDownloaded(true); // Setelah unduhan selesai, ubah state menjadi true
    };

    downloadFile();
  }, []);

  return (
    <div className='download-file-page'>
      {downloaded ? (
        <h1>Unduh berhasil!</h1>
      ) : (
        <h1>File sedang diunduh...</h1>
      )}
    </div>
  );
};

export default Download;
