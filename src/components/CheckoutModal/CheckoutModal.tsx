"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_KEY || ""
);

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    price: number;
    image: string;
    _id: string;
  };
}

const CheckoutForm = ({
  product,
  onClose,
}: {
  product: CheckoutModalProps["product"];
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setLoading(false);
      return;
    }

    // Since we are mocking the payment, we just create a payment method as our "transaction"
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || "An error occurred");
      setLoading(false);
      return;
    }

    try {
      // Use real user data from session, fallback to existing if undefined
      const userEmail = session?.user?.email || "guest@example.com";
      const userImage = session?.user?.image || "https://ui-avatars.com/api/?name=Guest+User";

      // Items array expected by backend
      const items = [
        {
          productId: product._id,
          name: product.name,
          quantity: 1,
          price: product.price,
          productImage: product.image,
        },
      ];

      // Call the backend initiate API
      const response = await fetch("https://t-mark-4.vercel.app/api/payment/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          userImage,
          items,
          totalAmount: product.price,
          transactionId: paymentMethod.id, // Using PaymentMethod ID as transactionId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.message || "Failed to save transaction.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during checkout.");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h3 className="font-bebas text-3xl mb-2 text-white">Payment Successful!</h3>
        <p className="text-white/60">Your order has been placed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h3 className="font-bebas text-3xl mb-6 text-white text-center">Checkout</h3>

      <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg flex items-center gap-4">
        <Image src={product.image} alt={product.name} width={64} height={64} className="w-16 h-16 object-cover rounded" />
        <div>
          <h4 className="font-bebas text-xl text-white">{product.name}</h4>
          <p className="text-white/60">${product.price}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-bebas tracking-widest text-white/50 mb-2">
          Card Details
        </label>
        <div className="p-4 bg-white border border-white/20 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#D9FF00] text-black font-bebas text-2xl py-4 rounded-md hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Pay $${product.price}`}
      </button>
    </form>
  );
};

const CheckoutModal = ({ isOpen, onClose, product }: CheckoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className="relative bg-[#111] border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white z-20"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Elements stripe={stripePromise}>
          <CheckoutForm product={product} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutModal;
