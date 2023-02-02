export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  plan: string;
  customerId: string;
  subscriptionId: string;
  registrationComplete: boolean;
  registrationStep: number;
  currency: string;
  monthlyPrice: number;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export type AuthContextType = {
  loading: boolean;
  formDataContext: object;
  setFormDataContext: (data: object) => void;
  user: IUser | null;
  error: string | null;
  setError: (error: string) => void;
  resetErrors: () => void;
  redirectUser: (user: IUser) => void;
  getStarted: (user: IUser) => void;
  registrationStepOne: (user: IUser) => void;
  registrationStepTwo: (user: IUser) => void;
  registrationStepThree: (user: IUser) => void;
  registrationStepFour: (user: IUser) => void;
  registrationStepFive: (user: IUser) => void;
  registrationCompleted: (user: IUser) => void;
  login: (user: IUser) => void;
  logout: () => void;
  isLoggedIn: () => Promise<void>;
  createOrder: (user: IUser) => void;
};
