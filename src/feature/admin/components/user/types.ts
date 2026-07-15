export type UserRole = "user" | "admin";

export type UserListRow = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date | string;
  _count: { orders: number; productReviews: number };
};

export type UserAddress = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export type UserOrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: Date | string;
  itemCount: number;
};

export type UserReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isApproved: boolean;
  createdAt: Date | string;
  product: { id: string; title: string; slug: string };
};

export type UserStats = {
  orderCount: number;
  orderTotalSpent: number;
  reviewCount: number;
  wishlistCount: number;
  cartItemCount: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date | string;
};
