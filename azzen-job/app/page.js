"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const CheckoutForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    orderId: "",
    amount: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMakeOrder = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.preprod.konnect.network/api/v2/payments/init-payment",
        {
          ...formData, // Spreads the current state into the request body
          receiverWalletId: "<YOUR_WALLET_ID>",
          acceptedPaymentMethods: ["bank_card", "e-DINAR", "flouci"],
          token: "TND",
          type: "immediate",
          lifespan: 10,
          checkoutForm: false,
          theme: "dark",
          addPaymentFeesToAmount: false,
          webhook: "<YOUR_WEBHOOK_URL>",
          silentWebhook: true,
          successUrl: "<YOUR_SUCCESS_URL>",
          failUrl: "<YOUR_FAIL_URL>",
        },
        {
          headers: {
            "x-api-key": "<YOUR_API_KEY>", // Replace with your actual API key
          },
        }
      );

      const { payUrl } = response.data;
      router.push(payUrl);
    } catch (error) {
      console.error("Error making order:", error);
      // Handle error here (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout Form</h2>

        {/* First Name */}
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full mb-4 p-3 border rounded"
        />

        {/* Last Name */}
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full mb-4 p-3 border rounded"
        />

        {/* Phone Number */}
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full mb-4 p-3 border rounded"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
        />

        {/* Order ID */}
        <input
          type="text"
          name="orderId"
          value={formData.orderId}
          onChange={handleChange}
          placeholder="Order ID"
          className="w-full mb-4 p-3 border rounded"
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount (in millimes, centimes)"
          className="w-full mb-4 p-3 border rounded"
        />

        <button
          onClick={handleMakeOrder}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Make an Order"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm;
