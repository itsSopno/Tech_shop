import React from "react";
import styles from "./about.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <div className="container">
        <h1>About Us</h1>
        <div className={styles.content}>
          <p>
            ESHOP is a modern e-commerce platform dedicated to providing the best shopping experience for our customers. 
            We believe in quality, transparency, and innovation.
          </p>
          <p>
            Our team of experts works tirelessly to source the most premium products and build a seamless digital interface 
            that makes shopping a delight.
          </p>
        </div>
      </div>
    </div>
  );
}
