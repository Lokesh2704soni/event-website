"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HomeContent = {
  title: string;
  subtitle: string;
  description: string;
};

export default function Home() {
  const [homeContent, setHomeContent] = useState<HomeContent>({
    title: "श्री खाटू श्याम",
    subtitle: "मंडल, अजमेर",
    description:
      "श्री खाटू श्याम मंडल, अजमेर में आपका हार्दिक स्वागत है। बाबा श्याम को हारे का सहारा माना जाता है। यह वेबसाइट मंडल से जुड़ी जानकारी, धार्मिक आयोजनों और भक्तों की सुंदर स्मृतियों को एक स्थान पर प्रस्तुत करने के लिए बनाई गई है।",
  });

  // =========================
  // HERO IMAGE SLIDER
  // =========================

  const heroImages = [
    "/1.jpeg",
    "/2.jpeg",
    "/3.jpeg",
    "/4.jpeg",
    "/5.jpeg",
    "/6.jpeg",
  ];

  const [currentHero, setCurrentHero] = useState(0);

  // Preload all hero images
  useEffect(() => {
    heroImages.forEach((image) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Auto slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((previous) => {
        return (previous + 1) % heroImages.length;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // LOAD HOME CONTENT
  // =========================

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const response = await fetch("/api/content");

        const data = await response.json();

        if (data.success && Array.isArray(data.content)) {
          const home = data.content.find(
            (item: { section: string }) =>
              item.section === "home"
          );

          if (home) {
            setHomeContent({
              title: home.title || "श्री खाटू श्याम",

              subtitle:
                home.subtitle || "मंडल, अजमेर",

              description:
                home.description ||
                "श्री खाटू श्याम मंडल, अजमेर में आपका हार्दिक स्वागत है। बाबा श्याम को हारे का सहारा माना जाता है।",
            });
          }
        }
      } catch (error) {
        console.error(
          "Home content error:",
          error
        );
      }
    }

    loadHomeContent();
  }, []);

  return (
    <main>

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div className="nav-container">

          <Link
            href="/"
            className="logo"
          >

            <div className="logo-icon">
              ॐ
            </div>

            <div>

              <h2>
                श्री खाटू श्याम
              </h2>

              <span>
                मंडल, अजमेर
              </span>

            </div>

          </Link>


          <nav className="nav-links">

            <Link href="/">
              Home
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/gallery">
              Gallery
            </Link>

            <Link href="/contact">
              Contact
            </Link>

          </nav>

        </div>

      </header>


      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        {/* Hero Image Slider */}

        <div className="hero-slider">

          {heroImages.map((image, index) => (

            <div
              key={image}
              className={`hero-slide ${
                index === currentHero
                  ? "active"
                  : ""
              }`}
              style={{
                backgroundImage: `url("${image}")`,
              }}
            />

          ))}

        </div>


        {/* Hero Overlay */}

        <div className="hero-overlay"></div>


        {/* Hero Content */}

        <div className="hero-content">

          <p className="welcome">
            🙏 जय श्री श्याम 🙏
          </p>


          <h1>

            {homeContent.title}

            <br />

            <span>
              {homeContent.subtitle}
            </span>

          </h1>


          <p className="tagline">
            हारे का सहारा, बाबा श्याम हमारा
          </p>


          <div className="buttons">

            <Link
              href="/gallery"
              className="btn primary"
            >
              दर्शन एवं गैलरी
            </Link>


            <Link
              href="/contact"
              className="btn secondary"
            >
              संपर्क करें
            </Link>

          </div>

        </div>


        {/* Slider Indicators */}

        <div className="hero-slider-dots">

          {heroImages.map((_, index) => (

            <button
              key={index}
              type="button"
              className={
                index === currentHero
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrentHero(index)
              }
              aria-label={`Slide ${index + 1}`}
            />

          ))}

        </div>

      </section>


      {/* =========================
          WELCOME SECTION
      ========================= */}

      <section className="welcome-section">

        <div className="container">

          <p className="section-label">
            ॥ श्री श्याम ॥
          </p>


          <h2>
            {homeContent.title} के पावन धाम में आपका स्वागत है
          </h2>


          <div className="gold-line"></div>


          <p className="description">
            {homeContent.description}
          </p>


          <Link
            href="/about"
            className="read-more"
          >
            मंडल के बारे में जानें →
          </Link>

        </div>

      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section className="features">

        <div className="container">

          <p className="section-label">
            विशेष जानकारी
          </p>


          <h2>
            श्याम दरबार से जुड़ें
          </h2>


          <div className="cards">

            {/* CARD 1 */}

            <div className="card">

              <div className="icon">
                🛕
              </div>

              <h3>
                मंडल परिचय
              </h3>

              <p>
                श्री खाटू श्याम मंडल और बाबा श्याम से जुड़ी
                महत्वपूर्ण जानकारी प्राप्त करें।
              </p>

              <Link href="/about">
                और जानें →
              </Link>

            </div>


            {/* CARD 2 */}

            <div className="card">

              <div className="icon">
                📸
              </div>

              <h3>
                कार्यक्रम एवं गैलरी
              </h3>

              <p>
                धार्मिक कार्यक्रमों और मंडल से जुड़ी
                सुंदर तस्वीरें देखें।
              </p>

              <Link href="/gallery">
                गैलरी देखें →
              </Link>

            </div>


            {/* CARD 3 */}

            <div className="card">

              <div className="icon">
                📍
              </div>

              <h3>
                स्थान एवं संपर्क
              </h3>

              <p>
                मंडल से जुड़ी संपर्क और स्थान की
                जानकारी प्राप्त करें।
              </p>

              <Link href="/contact">
                संपर्क करें →
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          QUOTE
      ========================= */}

      <section className="quote">

        <div>

          <span>
            “
          </span>

          <h2>

            हारे का सहारा,
            <br />
            बाबा श्याम हमारा

          </h2>

          <p>
            जय श्री श्याम 🙏
          </p>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        <div className="container footer-container">

          <div>

            <h2>
              श्री खाटू श्याम मंडल
            </h2>

            <p>
              अजमेर, राजस्थान
            </p>

          </div>


          <div className="footer-links">

            <Link href="/">
              Home
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/gallery">
              Gallery
            </Link>

            <Link href="/contact">
              Contact
            </Link>

          </div>

        </div>


        <div className="copyright">
          © 2026 श्री खाटू श्याम मंडल, अजमेर
        </div>

      </footer>

    </main>
  );
}