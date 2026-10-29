"use client";

import React from "react";
import styles from "./cart.module.scss";

const dummyItems = [
  { id: 1, name: "Premium Wireless Headphones", price: 299.99, category: "Electronics" },
  { id: 2, name: "Minimalist Wall Clock", price: 45.00, category: "Home Decor" },
  { id: 3, name: "Mechanical Keyboard", price: 129.50, category: "Accessories" },
];

export default function CartPage() {
  const subtotal = dummyItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

  return (
    <div className={styles.cart}>
      <div className="container">
        <h1>Your Shopping Cart</h1>

        <div className={styles.cartGrid}>
          <div className={styles.itemList}>
            {dummyItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.info}>
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                </div>
                <div className={styles.price}>${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Order Summary</h2>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
