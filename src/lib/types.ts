// Common types used throughout the application

// Chat types
export interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  isModerator: boolean;
}

export interface ChatUser {
  id: string;
  username: string;
  isActive: boolean;
  isModerator?: boolean;
}

// Merchandise types
export interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  addedDate: string;
  sortOrder: number;
  isLimited?: boolean;
}

// Show types
export interface Show {
  id: string;
  venue: string;
  location: string;
  date: string;
  imageUrl: string;
  ticketUrl: string;
  ticketStatus: 'Available' | 'Limited' | 'Sold Out';
  region: string;
  description?: string;
}

// Behind the scenes content
export interface BTSContent {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  date: string;
  videoUrl?: string;
  fullContent?: string;
}

// Leaderboard data
export interface LeaderboardItem {
  id: string;
  username: string;
  value: number; // Can represent money spent, hours streamed, or shows attended
  rank?: number;
  avatar?: string;
}

// Discount codes
export interface DiscountCode {
  id: string;
  title: string;
  code: string;
  type: 'merch' | 'tickets' | 'shipping' | 'other';
  description: string;
  expiryDate: string;
  discountAmount: string; // e.g. "20%" or "$5"
  minimumPurchase?: number;
}

// Announcement
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  isPinned: boolean;
}

// Unreleased tracks
export interface UnreleasedTrack {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  category: string;
  releaseStatus: string;
  createdDate: string;
}

// Support ticket
export interface SupportTicket {
  id: string;
  email: string;
  subject: string;
  category: string;
  description: string;
  orderId?: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

// Perks and memberships
export interface Perk {
  id: string;
  title: string;
  description: string;
  iconName: string;
  membershipTier: string;
  isFeatured?: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  description: string;
  features: string[];
  isPopular?: boolean;
}

// Resources
export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  category: string;
  isFeatured?: boolean;
  thumbnailUrl?: string;
}
