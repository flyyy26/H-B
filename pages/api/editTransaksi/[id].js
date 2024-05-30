import axios from 'axios';

const apiKey = 'd8086ade14369d53a3421d765793e0ac53ec8c4b';
const apiUrl = 'https://api.upos-conn.com/master/v1.3/api';

// Fungsi untuk melakukan PUT request ke endpoint editTransaksi
const updateTransactionStatus = async (transaksiId) => {
    try {
        // Data yang ingin diubah
        const data = {
            posStatus: 'Cancel'
        };

        // Konfigurasi axios
        const config = {
            headers: {
                'Content-Type': 'x-www-form-urlencoded',
                'X-API-Key': apiKey
            }
        };

        // Lakukan PUT request
        const response = await axios.put(`${apiUrl}/PosTransaksi/${transaksiId}`, data, config);

        console.log('Response from API:', response.data);

        return response.data; // Mengembalikan data dari response jika diperlukan
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error; // Lempar error untuk ditangkap di tempat penggunaan
    }
};

export { updateTransactionStatus };
