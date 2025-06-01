import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, Users, TrendingUp, Calendar, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["general", "release", "tour", "merchandise"]),
  priority: z.enum(["low", "medium", "high"]),
});

const btsContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  contentType: z.enum(["video", "photo", "audio", "document"]),
  category: z.enum(["projects", "live_shows"]),
  embedUrl: z.string().url("Must be a valid URL"),
});

const unreleasedTrackSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  audioUrl: z.string().url("Must be a valid URL"),
  duration: z.string().optional(),
  releaseDate: z.string().optional(),
});

type AnnouncementForm = z.infer<typeof announcementSchema>;
type BtsContentForm = z.infer<typeof btsContentSchema>;
type UnreleasedTrackForm = z.infer<typeof unreleasedTrackSchema>;

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const announcementForm = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general",
      priority: "medium",
    },
  });

  const btsForm = useForm<BtsContentForm>({
    resolver: zodResolver(btsContentSchema),
    defaultValues: {
      title: "",
      description: "",
      contentType: "video",
      category: "projects",
      embedUrl: "",
    },
  });

  const trackForm = useForm<UnreleasedTrackForm>({
    resolver: zodResolver(unreleasedTrackSchema),
    defaultValues: {
      title: "",
      description: "",
      audioUrl: "",
      duration: "",
      releaseDate: "",
    },
  });

  const onSubmitAnnouncement = async (data: AnnouncementForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/announcements", data);
      if (response.ok) {
        toast({
          title: "Announcement Posted!",
          description: "Your announcement has been published to the community.",
        });
        announcementForm.reset();
      } else {
        throw new Error("Failed to post announcement");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post announcement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitBtsContent = async (data: BtsContentForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/bts", data);
      if (response.ok) {
        toast({
          title: "Content Added!",
          description: "Behind-the-scenes content has been published.",
        });
        btsForm.reset();
      } else {
        throw new Error("Failed to add content");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitTrack = async (data: UnreleasedTrackForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/admin/tracks", data);
      if (response.ok) {
        toast({
          title: "Track Added!",
          description: "Unreleased track has been added to the library.",
        });
        trackForm.reset();
      } else {
        throw new Error("Failed to add track");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add track. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your fan community content and announcements</p>
        </div>

        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="bts" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Behind the Scenes
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Unreleased Music
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...announcementForm}>
                  <form onSubmit={announcementForm.handleSubmit(onSubmitAnnouncement)} className="space-y-6">
                    <FormField
                      control={announcementForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Announcement title..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={announcementForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Your announcement message..." className="min-h-32" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={announcementForm.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="release">New Release</SelectItem>
                                <SelectItem value="tour">Tour</SelectItem>
                                <SelectItem value="merchandise">Merchandise</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={announcementForm.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-warm-brown text-white hover:bg-warm-brown/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Publishing..." : "Publish Announcement"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bts">
            <Card>
              <CardHeader>
                <CardTitle>Add Behind-the-Scenes Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...btsForm}>
                  <form onSubmit={btsForm.handleSubmit(onSubmitBtsContent)} className="space-y-6">
                    <FormField
                      control={btsForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Content title..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={btsForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe this content..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={btsForm.control}
                        name="contentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="document">Document</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={btsForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="projects">Projects</SelectItem>
                                <SelectItem value="live_shows">Live Shows</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={btsForm.control}
                      name="embedUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Embed URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="YouTube, Vimeo, or other embed URL..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full bg-warm-brown text-white hover:bg-warm-brown/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add Content"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music">
            <Card>
              <CardHeader>
                <CardTitle>Add Unreleased Track</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...trackForm}>
                  <form onSubmit={trackForm.handleSubmit(onSubmitTrack)} className="space-y-6">
                    <FormField
                      control={trackForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Track Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Song title..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={trackForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Tell fans about this track..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={trackForm.control}
                      name="audioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audio URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SoundCloud, Spotify, or direct audio URL..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={trackForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="3:45" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={trackForm.control}
                        name="releaseDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Release Date (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-warm-brown text-white hover:bg-warm-brown/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Adding..." : "Add Track"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">---</div>
                  <p className="text-xs text-muted-foreground">Active subscribers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$---</div>
                  <p className="text-xs text-muted-foreground">From subscriptions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">---</div>
                  <p className="text-xs text-muted-foreground">Users online</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Announcements</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">---</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}