import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Users, Music, MessageCircle, ShoppingBag, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Helmet } from "react-helmet";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

type SignupForm = z.infer<typeof signupSchema>;

function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFullPerks, setShowFullPerks] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImage) return null;

    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { imageUrl } = await response.json();
        return imageUrl;
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
    return null;
  };

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);

    try {
      // Upload profile image first if provided
      const profileImageUrl = await uploadProfileImage();

      if (stripe && elements) {
        // Full Stripe payment flow when keys are available
        const response = await apiRequest("POST", "/api/auth/signup", {
          ...data,
          profileImageUrl,
          subscriptionPlan: "monthly" // $5/month plan
        });

        if (response.ok) {
          const { clientSecret } = await response.json();
          
          // Confirm payment with Stripe
          const cardElement = elements.getElement(CardElement);
          const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement!,
              billing_details: {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                address: {
                  city: data.city,
                  state: data.state,
                  country: data.country,
                },
              },
            },
          });

          if (error) {
            toast({
              title: "Payment Failed",
              description: error.message,
              variant: "destructive",
            });
          } else if (paymentIntent?.status === 'succeeded') {
            toast({
              title: "Welcome to the Community!",
              description: "Your account has been created and subscription is active.",
            });
            // Redirect to main app
            window.location.href = "/";
          }
        } else {
          const errorData = await response.json();
          toast({
            title: "Signup Failed",
            description: errorData.message || "Please try again",
            variant: "destructive",
          });
        }
      } else {
        // Simplified signup when Stripe isn't configured yet
        const response = await apiRequest("POST", "/api/auth/signup", {
          ...data,
          profileImageUrl,
          isMember: true,
          subscriptionStatus: "active"
        });

        if (response.ok) {
          toast({
            title: "Welcome to the Community!",
            description: "Your membership is now active. Enjoy exclusive access!",
          });
          
          // Redirect to homepage with full member access
          window.location.href = "/";
        } else {
          const errorData = await response.json();
          toast({
            title: "Signup Failed", 
            description: errorData.message || "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Full Perks Modal */}
        <Dialog open={showFullPerks} onOpenChange={setShowFullPerks}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-warm-brown text-center">
                Complete Membership Benefits
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">FREE Meet & Greet FOR LIFE</h3>
                    <p className="text-black text-sm">Meet Tristan personally at every show you attend</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">EXCLUSIVE Zoom hangs</h3>
                    <p className="text-black text-sm">ONLY for members - Join special video calls with Tristan and other fans</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Access to new music EARLY</h3>
                    <p className="text-black text-sm">Upcoming music will be released exclusively on the app before it's on Spotify, Apple, etc</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Unreleased Music</h3>
                    <p className="text-black text-sm">Access to exclusive tracks, demos, and unreleased content not available anywhere else</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">EXCLUSIVE Tristies Only Merch</h3>
                    <p className="text-black text-sm">Special merchandise available only for members here</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Discount on ALL Merch</h3>
                    <p className="text-black text-sm">Get special pricing on all merchandise in the store</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Announcements</h3>
                    <p className="text-black text-sm">Posted in the app first before Instagram, TikTok, etc.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Exclusive Behind-The-Scenes content</h3>
                    <p className="text-black text-sm">Access to behind the scenes videos, photos, and project updates</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Leaderboard System</h3>
                    <p className="text-black text-sm">Win prizes for streaming the most, coming to the most shows, or purchasing the most merch</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">GROUP CHAT</h3>
                    <p className="text-black text-sm">No separation by state or country. Everyone from everywhere can get to know each other in the chat and I'm in it too!</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Direct Message Access</h3>
                    <p className="text-black text-sm">Send private messages directly to Tristan</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black rounded-lg p-6">
                <div className="flex items-start">
                  <div className="mr-3 flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-warm-brown" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2 uppercase tracking-wider">Special Thank You</h3>
                    <p className="text-black text-sm">All members will have their name included in a special Thank You section in the description on ALL of my YouTube videos/songs/content</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">
            Join the Tristies Community
          </h1>
          <p className="text-xl text-gray-600">
            Become a member for just $5/month and unlock exclusive access
          </p>
        </div>

        {/* Key Benefits Preview */}
        <div className="mb-8">
          <div className="bg-white border-2 border-black rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-center text-warm-brown mb-6">
              MEMBERSHIP BENEFITS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-2">
                <div className="bg-warm-brown text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <Users className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-warm-brown">FREE MEET & GREET</h4>
              </div>
              <div className="text-center p-2">
                <div className="bg-warm-brown text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <Video className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-warm-brown">EXCLUSIVE ZOOM HANGS</h4>
              </div>
              <div className="text-center p-2">
                <div className="bg-warm-brown text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-warm-brown">TRISTIES ONLY MERCH</h4>
              </div>
              <div className="text-center p-2">
                <div className="bg-warm-brown text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <Music className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-warm-brown">UNRELEASED MUSIC</h4>
              </div>
              <div className="text-center p-2">
                <div className="bg-warm-brown text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-1">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-sm text-warm-brown">GROUP CHAT</h4>
              </div>
            </div>
            <div className="text-center">
              <button 
                onClick={() => setShowFullPerks(true)}
                className="text-warm-brown hover:underline font-semibold text-sm"
              >
                Click here to view a full list of membership perks
              </button>
            </div>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Join for $5/month and get instant access to all exclusive content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Account Info */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Choose a unique username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Picture (Optional)</label>
                  <div className="flex items-center space-x-4">
                    {profilePreview && (
                      <img 
                        src={profilePreview} 
                        alt="Profile preview" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-warm-brown file:text-white hover:file:bg-warm-brown/90"
                    />
                  </div>
                </div>

                {/* Location Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">PAYMENT INFORMATION</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Monthly subscription: $5.00/month - Cancel anytime
                  </p>
                  
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    {stripe && elements ? (
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
                          hidePostalCode: false,
                        }}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <Input 
                            placeholder="MM/YY" 
                          />
                          <Input 
                            placeholder="CVC" 
                          />
                        </div>
                        <Input 
                          placeholder="ZIP code" 
                        />
                        <div className="text-xs text-gray-400 text-center mt-2">
                          Secure payment processing powered by Stripe
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white text-black border-2 border-black hover:bg-gray-50 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Complete Signup"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By joining, you agree to our terms of service and privacy policy. 
                  You can cancel your subscription at any time.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Welcome() {
  return (
    <div>
      <Helmet>
        <title>Join the Community - Tristan Fan App</title>
        <meta name="description" content="Join Tristan's exclusive fan community for $5/month. Get access to unreleased music, behind-the-scenes content, exclusive merch, and direct connection with Tristan." />
        <meta property="og:title" content="Join the Tristies Community" />
        <meta property="og:description" content="Become a member for just $5/month and unlock exclusive access to unreleased music, behind-the-scenes content, and direct connection with Tristan." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Elements stripe={stripePromise}>
        <SignupForm />
      </Elements>
    </div>
  );
}