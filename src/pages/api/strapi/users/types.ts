export type IUser = {
  activeProfile?: string | null;
  email?: string;
  id?: string;
  isLoggedIn?: boolean;
  registrationComplete?: boolean;
  strapiToken?: string;
  stripeCustomerId?: string;
  subscriptions?: any;
  paymentMethods?: any;
  isActive?: boolean;
  clientSecret?: string | null;
  user?: any;
  message?: string;
};
