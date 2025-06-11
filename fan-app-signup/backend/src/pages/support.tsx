import { Helmet } from 'react-helmet';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const supportTicketSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  orderId: z.string().optional(),
});

type SupportTicketFormData = z.infer<typeof supportTicketSchema>;

export default function Support() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      email: "",
      subject: "",
      category: "",
      description: "",
      orderId: "",
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: (data: SupportTicketFormData) => 
      apiRequest("POST", "/api/support/tickets", data),
    onSuccess: () => {
      toast({
        title: "Ticket submitted",
        description: "We've received your support request and will respond shortly.",
        duration: 5000,
      });
      setSubmitted(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error submitting ticket",
        description: error.message || "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });
  
  const onSubmit = (data: SupportTicketFormData) => {
    mutate(data);
  };
  
  return (
    <div className="px-4 md:px-8 py-8 pb-20 md:pb-8">
      <Helmet>
        <title>Support | Tristan Community</title>
        <meta name="description" content="Get help with your account, merchandise orders, or technical issues. Submit a support ticket and our team will assist you." />
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Support</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-1 lg:order-1">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black uppercase tracking-wider">Submit a Support Ticket</CardTitle>
                <CardDescription className="text-black">
                  Our support team will respond to your request within 24-48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="bg-black/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-check-line text-black text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-medium text-black mb-2">Ticket Submitted!</h3>
                    <p className="text-black mb-6">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                    <Button 
                      className="bg-black text-white hover:bg-black/80 uppercase text-xs tracking-wider"
                      onClick={() => setSubmitted(false)}
                    >
                      Submit Another Ticket
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                              We'll send updates about your ticket to this email.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="account">Account Issues</SelectItem>
                                  <SelectItem value="merch">Merchandise & Orders</SelectItem>
                                  <SelectItem value="tickets">Concert Tickets</SelectItem>
                                  <SelectItem value="technical">Technical Support</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of your issue" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="orderId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order ID (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="If related to an order, enter the ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please provide details about your issue..."
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-black text-white hover:bg-black/80 uppercase text-xs tracking-wider"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Ticket"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 order-2 lg:order-2">
            <Card className="bg-white border-black">
              <CardHeader>
                <CardTitle className="text-black uppercase tracking-wider">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <i className="ri-mail-line text-black text-xl mr-3"></i>
                  <span className="text-black">tristanfanapp@gmail.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
