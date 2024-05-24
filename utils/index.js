export async function getAllProductsList(){
    const apiResponse = await fetch('https://dummyjson.com/products?limit=100');
    const result = await apiResponse.json()

    return  result && result.products && result.products.length > 0 ? result.products : []
}


export async function getProductDetails(getCurrentId){
    const apiResponse = await fetch(`https://dummyjson.com/products/${getCurrentId}`)
    const result = await apiResponse.json()


    return result;
}


export async function getListOfCartItems(){
    const apiResponse= await fetch('https://dummyjson.com/carts');
    const result = await apiResponse.json()

    return result && result.carts && result.carts.length > 0 ? result.carts : []
}


export async function getCartDetailsById(getCurrentId){
    const apiResponse = await fetch(`https://dummyjson.com/carts/${getCurrentId}`) 
    const result = await apiResponse.json()

    return result
}

export async function getListOfCategories() {
    try {
        const apiResponseCategories = await fetch('https://dummyjson.com/products/categories');
        const resultCategories = await apiResponseCategories.json();
        return resultCategories;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return null;
    }
} 


export async function getCategoriesDetail(category) {
    try {
        const apiResponseCategories = await fetch(`https://dummyjson.com/products/category/${category}`); // Pastikan URL benar
        const resultCategories = await apiResponseCategories.json();
        return resultCategories.products; // Asumsikan response memiliki property `products` yang berisi daftar produk
    } catch (error) {
        console.error('Error fetching category details:', error);
        return null;
    }
}


export async function getListOfPosts() {
    const apiResponse = await fetch('https://dummyjson.com/posts');
    const result = await apiResponse.json();

    return result && result.posts && result.posts.length > 0 ? result.posts : []
}

export async function getPostDetails(getCurrentId){
    const apiResponse = await fetch(`https://dummyjson.com/posts/${getCurrentId}`)
    const result = await apiResponse.json()


    return result;
}

// export async function getListBanner() {
//     const apiResponse = await fetch('https://roomcode.my.id/api/banners', {
//         headers: {
//             'Authorization': 'Bearer aGVlYuXDRtCZOBcoK8xjpluX0jqqDxDBvso7RqUe', // Ganti YOUR_API_KEY_HERE dengan API Key Anda
//             // Jika API memerlukan header khusus lainnya, tambahkan di sini
//         }
//     });
//     const result = await apiResponse.json();

//     return result && result.banner && result.banner.length > 0 ? result.banner : [];
// }


export async function getAllUsersList(){
    const apiResponse = await fetch('https://dummyjson.com/users');
    const result = await apiResponse.json();

    return result && result.users && result.users.length > 0 ? result.users : []
}

export async function getUserDetails(getCurrentId){
    const apiResponse = await fetch(`https://dummyjson.com/users/${getCurrentId}`)
    const result = await apiResponse.json()

    return result;
}

// export async function bannersData(url = '', data = {}) {
//     // Default options are marked with *
//     const response = await fetch(url, {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       headers: {
//         'Content-Type': 'application/json'
//         // jika diperlukan, Anda juga dapat menambahkan header lain di sini
//       },
//       body: JSON.stringify(data) // body data type must match "Content-Type" header
//     });
//     return await response.json(); // parses JSON response into native JavaScript objects
//   }

// utils/products.js

// Fungsi untuk mendapatkan produk secara acak dari API
export async function getRandomProducts(numberOfProducts) {
    try {
      // Lakukan permintaan ke API untuk mendapatkan produk
      const response = await fetch(`https://dummyjson.com/products?limit=100`);
      const data = await response.json();
  
      // Pastikan data respons valid
      if (!data || !data.products || data.products.length === 0) {
        throw new Error("No products found");
      }
  
      // Ambil beberapa produk secara acak dari respons API
      const allProducts = data.products;
      const randomProducts = [];
  
      while (randomProducts.length < numberOfProducts) {
        const randomIndex = Math.floor(Math.random() * allProducts.length);
        const randomProduct = allProducts[randomIndex];
        
        // Pastikan produk tidak diambil lebih dari satu kali
        if (!randomProducts.some(product => product.id === randomProduct.id)) {
          randomProducts.push(randomProduct);
        }
      }
  
      return randomProducts;
    } catch (error) {
      // Tangani kesalahan jika terjadi
      console.error("Error fetching random products:", error);
      throw new Error("Failed to fetch random products");
    }
  }
  