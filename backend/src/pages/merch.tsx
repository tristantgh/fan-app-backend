import { Helmet } from 'react-helmet';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MerchCard from "@/components/merch/MerchCard";
import type { MerchItem } from "@/lib/types";

export default function Merch() {
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: merchItems = [] } = useQuery<MerchItem[]>({
    queryKey: ['/api/merch'],
  });
  
  // Filter items by search query only
  const filteredItems = merchItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "newest":
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      default:
        return a.sortOrder - b.sortOrder; // featured
    }
  });
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8 max-w-6xl mx-auto">
      <Helmet>
        <title>Merchandise | Tristan Community</title>
        <meta name="description" content="Shop Tristan's official merchandise including clothing, vinyl records, posters, and limited edition items." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-8 uppercase tracking-wider">Merchandise</h1>
        
        {/* Regular Merch Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Official Merchandise</h2>
          <div className="bg-[#f8f8f8] border border-gray-200 rounded-lg p-6 max-w-2xl">
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-medium text-[#814923]">Exclusive Discount Code:</span> 
              <span className="font-mono bg-white px-3 py-2 ml-2 rounded border text-lg font-bold">OGTRISTIES</span>
            </p>
            <button 
              onClick={() => window.open('https://www.everythingtristan.co/store', '_blank')}
              className="bg-black text-white px-6 py-3 uppercase tracking-wider text-sm font-medium hover:bg-[#814923] transition-colors duration-200"
            >
              Shop Official Store
            </button>
          </div>
        </div>

        {/* Exclusive Member Merch Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wider">Exclusive Member Merch</h2>
          <div className="bg-[#f8f8f8] border border-gray-200 rounded-lg p-6 max-w-2xl">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-[#814923]">Password-Protected Collection</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Use Password: <span className="font-mono bg-white px-2 py-1 rounded border font-medium">forthebestfanseveronly</span>
            </p>
            <button 
              onClick={() => window.open('https://www.everythingtristan.co/tristiesonly', '_blank')}
              className="bg-black text-white px-6 py-3 uppercase tracking-wider text-sm font-medium hover:bg-[#814923] transition-colors duration-200"
            >
              Access Exclusive Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}