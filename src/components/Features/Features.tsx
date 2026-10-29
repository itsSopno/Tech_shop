import React from "react";
import styles from "./Features.module.scss";

const features = [
  {
    icon: "🚀",
    title: "Fast Delivery",
    description: "Get your items delivered to your doorstep in record time with our lightning-fast shipping.",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    description: "Shop with peace of mind using our enterprise-grade secure payment processing systems.",
  },
  {
    icon: "💎",
    title: "Premium Quality",
    description: "We source only the finest products from trusted global partners to ensure your satisfaction.",
  },
  {
    icon: "❤️",
    title: "24/7 Support",
    description: "Our dedicated support team is always available to help you with any questions or concerns.",
  },
];

const Features = () => {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.header}>
          <h2>Why Choose Us?</h2>
          <p>We provide the best shopping experience with top-notch features.</p>
        </div>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
