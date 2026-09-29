"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AboutContent = {
  title?: string;
  subtitle?: string;
  description?: string;
};

const defaultAbout: AboutContent = {
  title: "श्री लखदातार नवयुवक मंडल",
  subtitle: "अजमेर, राजस्थान",
  description:
    "श्री लखदातार नवयुवक मंडल, अजमेर भक्तों के लिए आस्था और श्रद्धा का पावन स्थान है। बाबा श्याम को हारे का सहारा माना जाता है। यह मंदिर भक्तों को आध्यात्मिक शांति, भक्ति और सकारात्मक ऊर्जा का अनुभव प्रदान करता है।",
};

export default function AboutPage() {
  const [aboutContent, setAboutContent] =
    useState<AboutContent>(defaultAbout);

  useEffect(() => {
    const loadAboutContent = async () => {
      try {
        const response = await fetch("/api/content");
        const data = await response.json();

        if (data.success && Array.isArray(data.content)) {
          const about = data.content.find(
            (item: AboutContent & { section?: string }) =>
              item.section === "about"
          );

          if (about) {
            setAboutContent({
              title: about.title || defaultAbout.title,
              subtitle: about.subtitle || defaultAbout.subtitle,
              description:
                about.description || defaultAbout.description,
            });
          }
        }
      } catch (error) {
        console.error("Failed to load About content:", error);
      }
    };

    loadAboutContent();
  }, []);

  return (
    <main>
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <div className="logo-icon">ॐ</div>

            <div>
              <h2>श्री लखदातार नवयुवक </h2>
              <span>मंडल, अजमेर</span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* About Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay"></div>

        <div className="page-hero-content">
          <p className="welcome">🙏 जय श्री श्याम 🙏</p>

          <h1>{aboutContent.title}</h1>

          <p>{aboutContent.subtitle}</p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-section">
        <div className="container">
          <p className="section-label">॥ श्री श्याम ॥</p>

          <h2>{aboutContent.title}</h2>

          <div className="gold-line"></div>

          <p className="description">
            {aboutContent.description}
          </p>

          <div className="about-highlight">
            <div className="about-highlight-icon">🙏</div>

            <div>
              <h3>जय श्री श्याम</h3>

              <p>
                हारे का सहारा, बाबा श्याम हमारा
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Temple Information */}
      <section className="features">
        <div className="container">
          <p className="section-label">विशेष जानकारी</p>

          <h2>बाबा श्याम की भक्ति</h2>

          <div className="cards">
            <div className="card">
              <div className="icon">🛕</div>

              <h3>पावन धाम</h3>

              <p>
                मंदिर भक्तों के लिए श्रद्धा और आस्था का
                महत्वपूर्ण स्थान है।
              </p>
            </div>

            <div className="card">
              <div className="icon">🙏</div>

              <h3>भक्ति एवं आस्था</h3>

              <p>
                बाबा श्याम के दर्शन और भक्ति से भक्त
                आध्यात्मिक शांति का अनुभव करते हैं।
              </p>
            </div>

            <div className="card">
              <div className="icon">📸</div>

              <h3>धार्मिक आयोजन</h3>

              <p>
                मंदिर में आयोजित होने वाले धार्मिक
                कार्यक्रमों और उत्सवों की स्मृतियां
                गैलरी में देखें।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="quote">
        <div>
          <span>“</span>

          <h2>
            हारे का सहारा,
            <br />
            बाबा श्याम हमारा
          </h2>

          <p>जय श्री श्याम 🙏</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-container">
          <div>
            <h2>श्री लखदातार नवयुवक मंडल</h2>
            <p>अजमेर, राजस्थान</p>
          </div>

          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div className="copyright">
          © 2026 श्री लखदातार नवयुवक मंडल, अजमेर
        </div>
      </footer>
    </main>
  );
}