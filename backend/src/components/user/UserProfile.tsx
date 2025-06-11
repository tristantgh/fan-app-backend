import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  profileImageUrl: z.string().url('Please enter a valid URL').optional(),
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    newReleaseAlerts: z.boolean().default(true),
    tourAlerts: z.boolean().default(true),
    merchandiseAlerts: z.boolean().default(true),
    newsletterSubscription: z.boolean().default(true),
    darkMode: z.boolean().default(false),
    language: z.string().default('en')
  })
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function UserProfile() {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: user, isLoading } = useQuery<{
    id: number;
    username: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    location: string | null; 
    profileImageUrl: string | null;
    bio: string | null;
    membershipTier: string;
    createdAt: string;
    updatedAt: string;
    preferences: {
      emailNotifications: boolean;
      newReleaseAlerts: boolean;
      tourAlerts: boolean;
      merchandiseAlerts: boolean;
      newsletterSubscription: boolean;
      darkMode: boolean;
      language: string;
    } | null;
  }>({
    queryKey: ['/api/auth/user'],
  });

  // Prepare form with user data when available
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      location: user?.location || '',
      email: user?.email || '',
      bio: user?.bio || '',
      profileImageUrl: user?.profileImageUrl || '',
      preferences: user?.preferences || {
        emailNotifications: true,
        newReleaseAlerts: true,
        tourAlerts: true,
        merchandiseAlerts: true,
        newsletterSubscription: true,
        darkMode: false,
        language: 'en'
      }
    }
  });

  // Update values when user data loads
  if (user && !isLoading && !isDirty) {
    setValue('firstName', user.firstName || '');
    setValue('lastName', user.lastName || '');
    setValue('location', user.location || '');
    setValue('email', user.email || '');
    setValue('bio', user.bio || '');
    setValue('profileImageUrl', user.profileImageUrl || '');
    setValue('preferences', user.preferences || {
      emailNotifications: true,
      newReleaseAlerts: true,
      tourAlerts: true,
      merchandiseAlerts: true,
      newsletterSubscription: true,
      darkMode: false,
      language: 'en'
    });
  }

  // Watch fields for preview
  const watchedFields = watch();

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
      
      // Update user data in cache
      queryClient.setQueryData(['/api/auth/user'], data.user);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Toggle preference handler
  const handleTogglePreference = (key: string, value: boolean) => {
    setValue(`preferences.${key}` as any, value, {
      shouldDirty: true,
    });
  };

  // Form submission handler
  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    updateProfileMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-[#814923] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={watchedFields.profileImageUrl || ''} alt={user?.username} />
              <AvatarFallback className="bg-[#814923] text-white text-xl">
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.username}</CardTitle>
              <CardDescription>
                {watchedFields.firstName && watchedFields.lastName ? 
                  `${watchedFields.firstName} ${watchedFields.lastName}` : 
                  'Fan Community Member'}
              </CardDescription>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              Membership: <span className="font-medium capitalize">{user?.membershipTier}</span>
            </p>
            <p className="text-sm text-gray-500">
              Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="personal">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Your last name"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Province, Country"
                    {...register('location')}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profileImageUrl">Profile Image URL</Label>
                <Input
                  id="profileImageUrl"
                  placeholder="https://example.com/your-image.jpg"
                  {...register('profileImageUrl')}
                />
                {errors.profileImageUrl && (
                  <p className="text-sm text-red-500">{errors.profileImageUrl.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  className="min-h-[100px]"
                  {...register('bio')}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  {watchedFields.bio?.length || 0}/500 characters
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Preferences</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive important updates via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={watchedFields.preferences?.emailNotifications}
                    onCheckedChange={(checked) => handleTogglePreference('emailNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newReleaseAlerts" className="text-base">New Release Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified about new music releases</p>
                  </div>
                  <Switch
                    id="newReleaseAlerts"
                    checked={watchedFields.preferences?.newReleaseAlerts}
                    onCheckedChange={(checked) => handleTogglePreference('newReleaseAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="tourAlerts" className="text-base">Tour & Show Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified about upcoming shows and tours</p>
                  </div>
                  <Switch
                    id="tourAlerts"
                    checked={watchedFields.preferences?.tourAlerts}
                    onCheckedChange={(checked) => handleTogglePreference('tourAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="merchandiseAlerts" className="text-base">Merchandise Alerts</Label>
                    <p className="text-sm text-gray-500">Get notified about new merch and exclusive drops</p>
                  </div>
                  <Switch
                    id="merchandiseAlerts"
                    checked={watchedFields.preferences?.merchandiseAlerts}
                    onCheckedChange={(checked) => handleTogglePreference('merchandiseAlerts', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletterSubscription" className="text-base">Newsletter Subscription</Label>
                    <p className="text-sm text-gray-500">Receive monthly newsletters with exclusive content</p>
                  </div>
                  <Switch
                    id="newsletterSubscription"
                    checked={watchedFields.preferences?.newsletterSubscription}
                    onCheckedChange={(checked) => handleTogglePreference('newsletterSubscription', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Display Preferences</h3>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode" className="text-base">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Toggle dark mode for the application</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={watchedFields.preferences?.darkMode}
                    onCheckedChange={(checked) => handleTogglePreference('darkMode', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border rounded-md"
                    value={watchedFields.preferences?.language}
                    onChange={(e) => handleTogglePreference('language', e.target.value as any)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </TabsContent>
            
            <div className="mt-6">
              <Button
                type="submit"
                className="bg-[#814923] hover:bg-[#66381c] w-full md:w-auto"
                disabled={isSubmitting || !isDirty}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}