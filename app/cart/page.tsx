"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import useCartStore from "@/store/cartStore";

export default function Cart() {
  const router = useRouter();
  const { items, removeFromCart, updateQty } = useCartStore((state) => state);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");

  const availableCoupons: { [key: string]: number } = {
    SAVE10: 0.1,
    SAVE20: 0.2,
    WELCOME: 0.15,
    FREESHIP: 0.05,
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const discountAmount = subtotal * discount;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.1;
  const total = discountedSubtotal + tax;

  const handleApplyCoupon = () => {
    setCouponError("");

    if (couponCode.trim() === "") {
      setCouponError("Please enter a coupon code");
      return;
    }

    const discountRate = availableCoupons[couponCode.toUpperCase()];
    if (discountRate) {
      setDiscount(discountRate);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code");
      setDiscount(0);
      setAppliedCoupon("");
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 px-6 py-12">
      <main className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            onClick={() => router.push("/home")}
            className="mr-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
          >
            ← Back to Home
          </Button>
          <h1 className="text-4xl font-extrabold">Your Cart</h1>
          <span className="ml-2 text-gray-400">
            ({items.reduce((sum, i) => sum + i.quantity, 0)} items)
          </span>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <div className="text-9xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-300">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Button
              onClick={() => router.push("/home/shop")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    width={90}
                    height={90}
                    className="rounded-md mr-5"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold">{item.title}</h2>
                    <p className="text-gray-400">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <Button
                        onClick={() => updateQty("decrement", item.id)}
                        className="bg-gray-700 hover:bg-gray-600 px-3"
                      >
                        -
                      </Button>
                      <span className="mx-4 text-lg">{item.quantity}</span>
                      <Button
                        onClick={() => updateQty("increment", item.id)}
                        className="bg-gray-700 hover:bg-gray-600 px-3"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold">Apply Discount</h3>
                {appliedCoupon ? (
                  <div className="flex justify-between bg-green-500 p-2 rounded-md">
                    <span className="font-bold text-white">{appliedCoupon}</span>
                    <Button
                      onClick={handleRemoveCoupon}
                      className="text-white hover:text-gray-200"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-grow p-2 bg-gray-700 text-white rounded-full focus:outline-none"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 ml-2 rounded-full"
                  >
                    Apply
                  </Button>
                </div>

                )}
                {couponError && <p className="text-red-400 mt-2">{couponError}</p>}
              </div>

              {/* Order Details */}
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between mb-2 text-green-400">
                  <span>Discount ({discount * 100}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mb-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-xl mt-4 border-t pt-4">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
