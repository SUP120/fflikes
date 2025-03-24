interface CashfreeCheckout {
  checkout: (config: {
    paymentSessionId: string;
    returnUrl: string;
  }) => Promise<void>;
}

interface Window {
  Cashfree: {
    new (config: { mode: 'production' | 'sandbox' }): CashfreeCheckout;
  };
} 