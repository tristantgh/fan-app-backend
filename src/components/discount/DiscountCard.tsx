import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clipboard } from "lucide-react";
import type { DiscountCode } from "@/lib/types";

interface DiscountCardProps {
  code: DiscountCode;
}

export default function DiscountCard({ code }: DiscountCardProps) {
  const { toast } = useToast();
  const [hovered, setHovered] = useState(false);
  
  // Get border color based on discount type
  const getBorderColor = () => {
    return hovered ? 'border-black/70' : 'border-black';
  };
  
  // Get badge background and text color based on discount type
  const getBadgeColors = () => {
    return 'bg-black text-white';
  };
  
  // Get button text color based on discount type
  const getButtonColor = () => {
    return 'text-black hover:text-black/80';
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.code);
    toast({
      title: "Code copied!",
      description: `${code.code} has been copied to your clipboard.`,
      duration: 3000,
    });
  };
  
  // Format the expiry date
  const formattedExpiryDate = new Date(code.expiryDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <Card 
      className={`bg-white rounded-md overflow-hidden border ${getBorderColor()} group transition duration-300`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-black uppercase tracking-wider">{code.title}</h3>
          <Badge className={`${getBadgeColors()} rounded-sm px-2 py-0.5 text-xs uppercase tracking-wider`}>
            Valid until {formattedExpiryDate}
          </Badge>
        </div>
        <p className="text-sm text-black mb-4">{code.description}</p>
        <div className="flex items-center justify-between bg-black/5 border border-black rounded-md p-3">
          <code className="text-black font-mono">{code.code}</code>
          <Button 
            variant="ghost" 
            size="sm"
            className={`${getButtonColor()} border border-black rounded-sm text-xs uppercase tracking-wider font-normal`}
            onClick={handleCopyCode}
          >
            <Clipboard className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
