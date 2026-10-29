import React from "react";
import styles from "./privacy.module.scss";

export default function PrivacyPage() {
  return (
    <div className={styles.privacy}>
      <div className="container">
        <h1>Privacy Policy</h1>
        <div className={styles.content}>
          <section>
            <h3>1. Information Collection</h3>
            <p>We collect information that you provide to us directly when you create an account, make a purchase, or communicate with us.</p>
          </section>
          
          <section>
            <h3>2. Use of Information</h3>
            <p>We use the information we collect to provide, maintain, and improve our services, and to process transactions.</p>
          </section>
          
          <section>
            <h3>3. Data Protection</h3>
            <p>We implement a variety of security measures to maintain the safety of your personal information.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
