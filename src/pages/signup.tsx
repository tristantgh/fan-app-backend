import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function SignupForm() {
  const stripe = useStripe();
  const elements = useElements();
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
    country: "",
    referredBy: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create user and subscription using the main Stripe integration
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          referredBy: formData.referredBy
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // If there's a client secret, we need to confirm payment with Stripe
        if (result.clientSecret) {
          const cardElement = elements?.getElement(CardElement);
          if (cardElement) {
            const { error, paymentIntent } = await stripe!.confirmCardPayment(result.clientSecret, {
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
            });

            if (error) {
              throw new Error(error.message || "Payment failed");
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
              toast({
                title: "Welcome to Tristies!",
                description: "Your subscription is active! Redirecting to download the app...",
              });
              
              // Redirect to app store based on device
              setTimeout(() => {
                const userAgent = navigator.userAgent || navigator.vendor;
                
                if (/android/i.test(userAgent)) {
                  // Android - redirect to Google Play Store
                  window.location.href = "https://play.google.com/store/apps/details?id=com.tristan.fanapp";
                } else if (/iPad|iPhone|iPod/.test(userAgent)) {
                  // iOS - redirect to App Store
                  window.location.href = "https://apps.apple.com/app/tristan-fan-community/id123456789";
                } else {
                  // Desktop/Other - provide download options
                  alert("Success! Please download the Tristan Fan App from your device's app store using the credentials you just created.");
                  window.location.href = "/";
                }
              }, 2000);
            }
          } else {
            throw new Error("Payment information required");
          }
        } else {
          // Direct success without payment needed
          toast({
            title: "Welcome to Tristies!",
            description: "Your account has been created successfully.",
          });
          
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } else {
        const result = await response.json();
        throw new Error(result.message || "Signup failed");
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
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                      <SelectItem value="Belgium">Belgium</SelectItem>
                      <SelectItem value="Switzerland">Switzerland</SelectItem>
                      <SelectItem value="Austria">Austria</SelectItem>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Norway">Norway</SelectItem>
                      <SelectItem value="Denmark">Denmark</SelectItem>
                      <SelectItem value="Finland">Finland</SelectItem>
                      <SelectItem value="Ireland">Ireland</SelectItem>
                      <SelectItem value="Portugal">Portugal</SelectItem>
                      <SelectItem value="Greece">Greece</SelectItem>
                      <SelectItem value="Poland">Poland</SelectItem>
                      <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                      <SelectItem value="Hungary">Hungary</SelectItem>
                      <SelectItem value="Slovakia">Slovakia</SelectItem>
                      <SelectItem value="Slovenia">Slovenia</SelectItem>
                      <SelectItem value="Croatia">Croatia</SelectItem>
                      <SelectItem value="Estonia">Estonia</SelectItem>
                      <SelectItem value="Latvia">Latvia</SelectItem>
                      <SelectItem value="Lithuania">Lithuania</SelectItem>
                      <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                      <SelectItem value="Malta">Malta</SelectItem>
                      <SelectItem value="Cyprus">Cyprus</SelectItem>
                      <SelectItem value="Iceland">Iceland</SelectItem>
                      <SelectItem value="Liechtenstein">Liechtenstein</SelectItem>
                      <SelectItem value="Monaco">Monaco</SelectItem>
                      <SelectItem value="San Marino">San Marino</SelectItem>
                      <SelectItem value="Vatican City">Vatican City</SelectItem>
                      <SelectItem value="Andorra">Andorra</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Taiwan">Taiwan</SelectItem>
                      <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="Malaysia">Malaysia</SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                      <SelectItem value="Philippines">Philippines</SelectItem>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                      <SelectItem value="Bhutan">Bhutan</SelectItem>
                      <SelectItem value="Maldives">Maldives</SelectItem>
                      <SelectItem value="Myanmar">Myanmar</SelectItem>
                      <SelectItem value="Cambodia">Cambodia</SelectItem>
                      <SelectItem value="Laos">Laos</SelectItem>
                      <SelectItem value="Brunei">Brunei</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="Fiji">Fiji</SelectItem>
                      <SelectItem value="Papua New Guinea">Papua New Guinea</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Chile">Chile</SelectItem>
                      <SelectItem value="Uruguay">Uruguay</SelectItem>
                      <SelectItem value="Paraguay">Paraguay</SelectItem>
                      <SelectItem value="Bolivia">Bolivia</SelectItem>
                      <SelectItem value="Peru">Peru</SelectItem>
                      <SelectItem value="Ecuador">Ecuador</SelectItem>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                      <SelectItem value="Venezuela">Venezuela</SelectItem>
                      <SelectItem value="Guyana">Guyana</SelectItem>
                      <SelectItem value="Suriname">Suriname</SelectItem>
                      <SelectItem value="French Guiana">French Guiana</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="Guatemala">Guatemala</SelectItem>
                      <SelectItem value="Belize">Belize</SelectItem>
                      <SelectItem value="El Salvador">El Salvador</SelectItem>
                      <SelectItem value="Honduras">Honduras</SelectItem>
                      <SelectItem value="Nicaragua">Nicaragua</SelectItem>
                      <SelectItem value="Costa Rica">Costa Rica</SelectItem>
                      <SelectItem value="Panama">Panama</SelectItem>
                      <SelectItem value="Cuba">Cuba</SelectItem>
                      <SelectItem value="Jamaica">Jamaica</SelectItem>
                      <SelectItem value="Haiti">Haiti</SelectItem>
                      <SelectItem value="Dominican Republic">Dominican Republic</SelectItem>
                      <SelectItem value="Puerto Rico">Puerto Rico</SelectItem>
                      <SelectItem value="Trinidad and Tobago">Trinidad and Tobago</SelectItem>
                      <SelectItem value="Barbados">Barbados</SelectItem>
                      <SelectItem value="Bahamas">Bahamas</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Egypt">Egypt</SelectItem>
                      <SelectItem value="Morocco">Morocco</SelectItem>
                      <SelectItem value="Tunisia">Tunisia</SelectItem>
                      <SelectItem value="Algeria">Algeria</SelectItem>
                      <SelectItem value="Libya">Libya</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="Rwanda">Rwanda</SelectItem>
                      <SelectItem value="Botswana">Botswana</SelectItem>
                      <SelectItem value="Namibia">Namibia</SelectItem>
                      <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                      <SelectItem value="Zambia">Zambia</SelectItem>
                      <SelectItem value="Malawi">Malawi</SelectItem>
                      <SelectItem value="Mozambique">Mozambique</SelectItem>
                      <SelectItem value="Madagascar">Madagascar</SelectItem>
                      <SelectItem value="Mauritius">Mauritius</SelectItem>
                      <SelectItem value="Seychelles">Seychelles</SelectItem>
                      <SelectItem value="Israel">Israel</SelectItem>
                      <SelectItem value="Turkey">Turkey</SelectItem>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                      <SelectItem value="Qatar">Qatar</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                      <SelectItem value="Bahrain">Bahrain</SelectItem>
                      <SelectItem value="Oman">Oman</SelectItem>
                      <SelectItem value="Jordan">Jordan</SelectItem>
                      <SelectItem value="Lebanon">Lebanon</SelectItem>
                      <SelectItem value="Cyprus">Cyprus</SelectItem>
                      <SelectItem value="Russia">Russia</SelectItem>
                      <SelectItem value="Ukraine">Ukraine</SelectItem>
                      <SelectItem value="Belarus">Belarus</SelectItem>
                      <SelectItem value="Moldova">Moldova</SelectItem>
                      <SelectItem value="Romania">Romania</SelectItem>
                      <SelectItem value="Bulgaria">Bulgaria</SelectItem>
                      <SelectItem value="Serbia">Serbia</SelectItem>
                      <SelectItem value="Montenegro">Montenegro</SelectItem>
                      <SelectItem value="Bosnia and Herzegovina">Bosnia and Herzegovina</SelectItem>
                      <SelectItem value="North Macedonia">North Macedonia</SelectItem>
                      <SelectItem value="Albania">Albania</SelectItem>
                      <SelectItem value="Kosovo">Kosovo</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Armenia">Armenia</SelectItem>
                      <SelectItem value="Azerbaijan">Azerbaijan</SelectItem>
                      <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
                      <SelectItem value="Uzbekistan">Uzbekistan</SelectItem>
                      <SelectItem value="Kyrgyzstan">Kyrgyzstan</SelectItem>
                      <SelectItem value="Tajikistan">Tajikistan</SelectItem>
                      <SelectItem value="Turkmenistan">Turkmenistan</SelectItem>
                      <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                      <SelectItem value="Iran">Iran</SelectItem>
                      <SelectItem value="Iraq">Iraq</SelectItem>
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
                  onClick={() => window.location.href = '/'}
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

export default function Signup() {
  return (
    <>
      <Helmet>
        <title>Join Tristan's Fan Community - Exclusive Access</title>
        <meta name="description" content="Join Tristan's exclusive fan community for $5/month. Get access to unreleased music, behind-the-scenes content, group chat, and more." />
      </Helmet>
      
      <Elements stripe={stripePromise}>
        <SignupForm />
      </Elements>
    </>
  );
}