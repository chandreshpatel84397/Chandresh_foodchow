"use client";

import { useState } from "react";



const restaurantLink = "https://foodchowdemoindia.foodchow.com";

const steps = [
  {
    id: 1,
    title: "Add Your Menu",
    desc: "Add items with prices and images to start receiving orders.",
    cta: "Add Menu",
    done: true,
  },
  {
    id: 2,
    title: "Set Your Timings",
    desc: "Add your business hours so customers know when to order.",
    cta: "Setup Timing",
    done: true,
  },
  {
    id: 3,
    title: "Save & Publish",
    desc: "Publish your Restaurant on our Marketplace to get more orders.",
    cta: "Published",
    done: true,
  },
];

export default function DashboardPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(restaurantLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="dashboard-page">
      <section className="download-card">
        <div className="download-left">
          <h1>Download Our App</h1>
          <p>
            You can now manage online orders. To handle them directly on your
            restaurant system, download the Foodchow POS software. With your
            current plan, you can only accept or decline online orders. Log in
            to the POS using your email address and password.
          </p>

          <div className="store-actions">
            <a
              //href={links.playStore}
              className="store-btn store-badge"
              target="_blank"
              rel="noreferrer"
            >
              <span className="store-top">GET IT ON</span>
              <span className="store-main">Google Play</span>
            </a>

            <a
              //href={links.appStore}
              className="store-btn store-badge"
              target="_blank"
              rel="noreferrer"
            >
              <span className="store-top">Download on the</span>
              <span className="store-main">App Store</span>
            </a>

            <a
              //href={links.windowsPos}
              className="store-btn windows-btn"
              target="_blank"
              rel="noreferrer"
            >
              Download For Windows
            </a>
          </div>
        </div>

        <div className="download-right" aria-hidden>
          <div className="mobile-card first" />
          <div className="mobile-card second" />
          <div className="terminal-card">
            <div className="terminal-top" />
            <div className="terminal-screen" />
            <div className="terminal-body" />
          </div>
        </div>
      </section>

      <section className="share-card">
        <h2>Share your restaurant link with customer</h2>
        <div className="share-controls">
          <a href={restaurantLink} target="_blank" rel="noreferrer">
            {restaurantLink}
          </a>
          <a
            href={restaurantLink}
            target="_blank"
            rel="noreferrer"
            className="share-btn link-btn"
          >
            View Page
          </a>
          <button type="button" className="share-btn" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      <section className="welcome-card">
  <div className="welcome-header">
    <span className="welcome-badge">WELCOME</span>
    <h3>Welcome to your Foodchow ! Let&apos;s set up your restaurant step by step.</h3>
  </div>

  <div className="step-grid">
    {steps.map((step, index) => (
      <article key={step.id} className="step-item">
        <div className="step-chip">
          <span className="check">✓</span>
          Step {step.id}
        </div>

        {index < steps.length - 1 && <span className="connector" aria-hidden />}

        <div className="step-icon" aria-hidden>
          <span className={`step-glyph step-glyph-${step.id}`}>{step.id}</span>
        </div>

        <h4>{step.title}</h4>
        <p>{step.desc}</p>

        {step.id === 1 ? (
          <a href="/Items" className="step-action">
            {step.cta}
          </a>
        ) : step.id === 2 ? (
          <a href="/additional_menu/display" className="step-action">
            {step.cta}
          </a>
        ) : (
          <button
            type="button"
            className="step-action muted"
            disabled
          >
            {step.cta}
          </button>
        )}
      </article>
    ))}
  </div>
</section>
    </main>
  );
}
