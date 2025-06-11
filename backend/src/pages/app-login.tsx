import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";

interface AppLoginProps {
  onLoginSuccess: (token: string) => void;
}

export default function AppLogin({ onLoginSuccess }: AppLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if it's the test account
      if (loginData.email === 'test@tristies.com' && loginData.password === 'testpass123') {
        // Create a test token for PWA testing
        const tokenPayload = {
          user_id: 1,
          email: 'test@tristies.com',
          subscription_status: 'active',
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
        };
        
        const testToken = `header.${btoa(JSON.stringify(tokenPayload))}.signature`;
        
        // Store the JWT token
        localStorage.setItem('fanAppToken', testToken);
        
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        
        // Force refresh the page to trigger auth state update
        window.location.reload();
        return;
      }

      // For other accounts, try the backend
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem('fanAppToken', result.token);
        
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        
        onLoginSuccess(result.token);
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
      <Helmet>
        <title>Tristies Fan App - Login</title>
        <meta name="description" content="Log in to access Tristan's exclusive fan community with unreleased music, behind-the-scenes content, and direct connection with Tristan." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Main Login Card */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome to the Community</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </CardContent>
          </Card>


        </div>
      </div>
    </>
  );
}