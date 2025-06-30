import React from 'react';
import theme from '../theme';
import { useNavigate } from 'react-router-dom';

function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* Back to Home */}
      <div
        style={{
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <span style={{ fontSize: '1.1rem', color: theme.colors.primary }}>
          ← Back to Home
        </span>
      </div>

      {/* Title */}
      <h1 style={{ fontSize: '2rem', color: theme.colors.primary, marginBottom: '1rem' }}>
        About Us
      </h1>

      {/* Description */}
      <div style={{ fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
        <p>
          Welcome to <strong>FreshMeat</strong>, the <strong>first-ever online meat delivery service in Dharmavaram</strong>, where freshness meets convenience. We’re proud to bring you the highest quality meat, cleaned and cut with precision, and delivered safely to your doorstep.
        </p>

        <p>
          Our mission is simple — to provide you with <strong>farm-fresh, hygienically handled, and expertly packed meat</strong> that fits right into your busy lifestyle. No more standing in long lines, worrying about quality, or second-guessing where your meat comes from.
        </p>

        <p>
          Whether it's tender chicken, juicy mutton, or fresh seafood, every product at FreshMeat is sourced from trusted farms and suppliers. Our meat is processed with care and handled under strict hygiene standards to ensure safety and satisfaction in every bite.
        </p>

        <p>
          At FreshMeat, we’re not just delivering meat — we’re building trust, one delivery at a time. As Dharmavaram’s first in this space, we're excited to lead with quality, reliability, and unmatched customer service.
        </p>

        <p>
          Thank you for choosing FreshMeat — your local, fresh, and reliable meat partner.
        </p>
      </div>

      {/* Footer */}
      <section
        style={{
          backgroundColor: '#555555',
          color: '#fff',
          textAlign: 'center',
          padding: '1rem',
          marginTop: '2rem',
          borderRadius: '12px',
          fontSize: '0.8rem',
          lineHeight: '1.5',
        }}
      >
        <p style={{ marginBottom: '0.8rem', fontWeight: '400' }}>
          © 2025 FreshMeat Pvt Ltd. All Rights Reserved.
        </p>
        <p>
          FreshMeat is your one-stop fresh meat delivery shop. Get the freshest meat delivered straight to your doorstep in Dharmavaram.
        </p>
      </section>
    </div>
  );
}

export default AboutUsPage;
