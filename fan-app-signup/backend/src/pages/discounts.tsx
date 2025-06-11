import { Helmet } from 'react-helmet';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DiscountCard from "@/components/discount/DiscountCard";
import type { DiscountCode } from "@/lib/types";

export default function Discounts() {
  const { data: discountCodes = [] } = useQuery<DiscountCode[]>({
    queryKey: ['/api/discounts'],
  });
  
  // Separate active and expired codes
  const now = new Date();
  
  const activeCodes = discountCodes.filter(code => 
    new Date(code.expiryDate) > now
  ).sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime());
  
  const expiredCodes = discountCodes.filter(code => 
    new Date(code.expiryDate) <= now
  ).sort((a, b) => new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime());
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Discount Codes | Tristan Community</title>
        <meta name="description" content="Exclusive discount codes for merchandise, concert tickets, and more - available only to Tristan's fan community members." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Discount Codes</h1>
        
        <Card className="bg-white border-black mb-8">
          <CardHeader>
            <CardTitle className="text-black uppercase tracking-wider">Member Exclusive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-black">
              These discount codes are exclusive to fan community members. They are valid for the specified period and may be subject to additional terms and conditions at checkout.
            </p>
          </CardContent>
        </Card>
        
        <h2 className="text-2xl font-bold mb-4">Active Discounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeCodes.map(code => (
            <DiscountCard key={code.id} code={code} />
          ))}
          
          {activeCodes.length === 0 && (
            <div className="col-span-full py-8 text-center bg-[#1e1e1e] rounded-lg">
              <i className="ri-coupon-3-line text-4xl text-gray-500 mb-3"></i>
              <p className="text-gray-400">No active discount codes available right now. Check back soon!</p>
            </div>
          )}
        </div>
        
        {expiredCodes.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Expired Discounts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiredCodes.map(code => (
                <DiscountCard key={code.id} code={code} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
