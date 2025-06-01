import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Helmet } from "react-helmet";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function LoginForm({ onBackToSignup }: { onBackToSignup: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    usernameOrEmail: "",
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
      const response = await apiRequest("POST", "/api/auth/login", {
        usernameOrEmail: loginData.usernameOrEmail,
        password: loginData.password
      });

      if (response.ok) {
        toast({
          title: "Welcome back!",
          description: "You've been logged in successfully.",
        });
        
        // Refresh the page to trigger auth state update
        window.location.reload();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Log in to your Tristies account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usernameOrEmail">Username or Email</Label>
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={loginData.usernameOrEmail}
                onChange={handleInputChange}
                required
                placeholder="Enter your username or email"
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
            
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-warm-brown hover:text-warm-brown/80"
                onClick={onBackToSignup}
                type="button"
              >
                Don't have an account? Sign up here
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SignupForm({ onShowLogin }: { onShowLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    country: "United States",
    profileImageUrl: "",
    referredBy: ""
  });
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      toast({
        title: "Payment Error",
        description: "Stripe is not loaded yet. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create user account first
      const response = await apiRequest("POST", "/api/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        profileImageUrl: formData.profileImageUrl,
        referredBy: formData.referredBy,
        subscriptionPlan: "monthly"
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Signup result:", result);
        
        if (!result.clientSecret) {
          throw new Error("Payment setup failed - no client secret received");
        }
        
        // Confirm payment with Stripe
        const cardElement = elements.getElement(CardElement);
        if (cardElement) {
          console.log("Processing payment with client secret:", result.clientSecret);
          
          const { error, paymentIntent } = await stripe.confirmCardPayment(result.clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                address: {
                  city: formData.city,
                  state: formData.state,
                  country: formData.country === 'United States' ? 'US' : 
                          formData.country === 'Canada' ? 'CA' :
                          formData.country === 'United Kingdom' ? 'GB' :
                          formData.country === 'Australia' ? 'AU' :
                          formData.country.substring(0, 2).toUpperCase(),
                }
              },
            },
            receipt_email: formData.email,
          });

          console.log("Payment result:", { error, paymentIntent });

          if (error) {
            console.error("Payment error:", error);
            toast({
              title: "Payment Failed",
              description: error.message || "Payment could not be processed",
              variant: "destructive",
            });
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log("Payment succeeded:", paymentIntent);
            
            // Confirm payment on the backend
            try {
              await apiRequest("POST", "/api/confirm-payment", {
                paymentIntentId: paymentIntent.id
              });
              
              toast({
                title: "Welcome to Tristies!",
                description: "Your account has been created and payment processed successfully.",
              });
              
              // Refresh the page to trigger auth state update
              window.location.reload();
            } catch (confirmError) {
              console.error("Payment confirmation error:", confirmError);
              // Still let them in since payment succeeded
              toast({
                title: "Welcome to Tristies!",
                description: "Payment processed successfully. Welcome to the community!",
              });
              window.location.reload();
            }
          } else {
            console.warn("Payment status unclear:", paymentIntent?.status);
            toast({
              title: "Payment Processing",
              description: "Your payment is being processed. You should receive access shortly.",
            });
            
            // Still refresh to let them in while payment processes
            setTimeout(() => window.location.reload(), 2000);
          }
        } else {
          throw new Error("Card information not found");
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || "Signup failed");
      }
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">JOIN TRISTAN'S FAN COMMUNITY</h1>
          <p className="text-muted-foreground mb-6">
            Get exclusive access to unreleased music, behind-the-scenes content, and direct chat with Tristan and other fans
          </p>
          
          {/* Member Benefits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>EXCLUSIVE MEMBER BENEFITS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-semibold mb-4">FREE MEET & GREET FOR LIFE</h3>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">EXCLUSIVE ZOOM HANGS</h3>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">TRISTIES ONLY MERCH</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-6">
                <div>
                  <h3 className="font-semibold mb-4">UNRELEASED MUSIC</h3>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">GROUP CHAT</h3>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">AND MORE</h3>
                </div>
              </div>
              <div className="text-center mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-warm-brown">
                      Click here to view a full list of membership perks
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-center mb-4">Complete Membership Perks</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-6">Here's a list of all the perks included with your membership :)</p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ FREE MEET & GREET FOR LIFE</h3>
                          <p className="text-sm text-muted-foreground">Get exclusive access to meet and greets at every show, completely free for members</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ EXCLUSIVE ZOOM HANGS ONLY FOR MEMBERS</h3>
                          <p className="text-sm text-muted-foreground">Member Only zoom hangs with live performances, Q&As and more!</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ ACCESS TO NEW MUSIC EARLY</h3>
                          <p className="text-sm text-muted-foreground">Upcoming music will be released exclusively on the app before it's on Spotify, Apple, etc :)</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ UNRELEASED MUSIC</h3>
                          <p className="text-sm text-muted-foreground">Access to exclusive tracks, demos, and unreleased content not available anywhere else</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ EXCLUSIVE TRISTIES ONLY MERCH</h3>
                          <p className="text-sm text-muted-foreground">Special merchandise available only for members here</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ DISCOUNT ON ALL MERCH</h3>
                          <p className="text-sm text-muted-foreground">Get special pricing on all merchandise in the store</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ ANNOUNCEMENTS</h3>
                          <p className="text-sm text-muted-foreground">Posted in the app first before Instagram, TikTok, etc.</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ EXCLUSIVE BEHIND-THE-SCENES CONTENT</h3>
                          <p className="text-sm text-muted-foreground">Get access to exclusive content showing my creative process</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ LEADERBOARD SYSTEM</h3>
                          <p className="text-sm text-muted-foreground">Win prizes for streaming the most, coming to the most shows, or purchasing the most merch</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ GROUP CHAT</h3>
                          <p className="text-sm text-muted-foreground">No separation by state or country. Everyone from everywhere can get to know each other in the chat and I'm in it too!</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ SPECIAL THANK YOU RECOGNITION</h3>
                          <p className="text-sm text-muted-foreground">All members will have their name included in a special Thank You section in the description on ALL of my YouTube videos/songs/content</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">✓ DIRECT MESSAGE ACCESS TO ME</h3>
                          <p className="text-sm text-muted-foreground">The more people that join our community overall, the harder it is for me to keep up with messages, but if you're a member here you're guaranteed that I'll see and get to your message as soon as I can :)</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Signup Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>Join for $5/month and get instant access to all exclusive content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="First name is required"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Last name is required"
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  placeholder="Choose a unique username"
                />
                <p className="text-sm text-muted-foreground">Username must be at least 3 characters</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Please enter a valid email address"
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Password must be at least 8 characters"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City is required"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="State/Province is required"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-2">
                <Label htmlFor="referredBy">Referred by a friend? (Optional)</Label>
                <Input
                  id="referredBy"
                  name="referredBy"
                  value={formData.referredBy}
                  onChange={handleInputChange}
                  placeholder="Enter their username"
                />
              </div>

              {/* Payment Information */}
              <div className="space-y-4 pt-6 border-t">
                <h3 className="text-lg font-semibold">PAYMENT INFORMATION</h3>
                <p className="text-sm text-muted-foreground">Monthly subscription: $5.00/month - Cancel anytime</p>
                
                <div className="p-4 border rounded-lg">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold"
                disabled={isLoading || !stripe}
              >
                {isLoading ? "Processing..." : "Complete Signup"}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  className="text-warm-brown hover:text-warm-brown/80"
                  onClick={onShowLogin}
                  type="button"
                >
                  Already have an account? Log in here
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                By joining, you agree to our terms of service and privacy policy. You can cancel your subscription at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Welcome() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <Helmet>
        <title>Join Tristan's Fan Community - Exclusive Access</title>
        <meta name="description" content="Join Tristan's exclusive fan community for $5/month. Get access to unreleased music, behind-the-scenes content, group chat, and more." />
      </Helmet>
      
      {showLogin ? (
        <LoginForm onBackToSignup={() => setShowLogin(false)} />
      ) : (
        <Elements stripe={stripePromise}>
          <SignupForm onShowLogin={() => setShowLogin(true)} />
        </Elements>
      )}
    </>
  );
}