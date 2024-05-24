// components/SearchBar.js
import { useState } from "react";
import { useRouter } from "next/router";
import { LuSearch } from "react-icons/lu"; // Pastikan ini benar, atau sesuaikan import icon search

export default function SearchBar() {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        // Redirect to the dynamic search page
        if (searchTerm.trim()) {
        router.push(`/catalog-product/search/${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="search">
            <input
                type="text"
                placeholder="Cari Produk Disini"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit"><LuSearch /></button>
        </form>
    );
}
