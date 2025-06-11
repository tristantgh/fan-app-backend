import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { MerchItem } from "@/lib/types";

interface MerchCardProps {
  item: MerchItem;
}

export default function MerchCard({ item }: MerchCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  const handlePurchase = () => {
    // Direct to your password-protected Squarespace store
    window.open('https://everythingtristan.co/store', '_blank');
  };
  
  return (
    <div className="group cursor-pointer">
      <div 
        className="aspect-square overflow-hidden bg-gray-50 mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className={`object-cover h-full w-full object-center transition duration-300 ${isHovered ? 'scale-105' : ''}`}
          onError={(e) => {
            // Fallback for broken images
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400/f5f5f5/333333?text=' + encodeURIComponent(item.name);
          }}
        />
        {item.isLimited && (
          <div className="absolute top-3 left-3">
            <span className="bg-black text-white text-xs px-2 py-1 uppercase tracking-wider">
              Limited
            </span>
          </div>
        )}
        {!item.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium uppercase tracking-wider text-sm">Sold Out</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-black uppercase tracking-wide">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-black font-medium">
            ${item.price.toFixed(2)}
          </span>
          <Button
            onClick={handlePurchase}
            disabled={!item.inStock}
            size="sm"
            variant="outline"
            className="border-black text-black hover:bg-black hover:text-white text-xs uppercase tracking-wider h-8 px-3"
          >
            {!item.inStock ? "Sold Out" : "Shop"}
          </Button>
        </div>
      </div>
    </div>
  );
}
