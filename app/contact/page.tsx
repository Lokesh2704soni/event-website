"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ContactContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  mapUrl?: string;
};

const defaultContact: ContactContent = {
  title: "संपर्क करें",
  subtitle: "श्री खाटू श्याम मंदिर, अजमेर",
  description:
    "मंदिर से जुड़ी जानकारी, कार्यक्रमों या अन्य किसी विषय के लिए हमसे संपर्क करें।",
  phone: "+919999999999",
  email: "info@example.com",
  address: "श्री खाटू श्याम मंदिर, अजमेर, राजस्थान",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=Khatu+Shyam+Mandir+Ajmer",
};

export default function ContactPage() {
  const [contact, setContact] =
    useState<ContactContent>(defaultContact);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [formMessage, setFormMessage] =
    useState("");

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    const loadContactContent = async () => {
      try {
        const response = await fetch("/api/content");
        const data = await response.json();

        if (data.success && Array.isArray(data.content)) {
          const contactData = data.content.find(
            (
              item: ContactContent & {
                section?: string;
              }
            ) => item.section === "contact"
          );

          if (contactData) {
            setContact({
              title:
                contactData.title ||
                defaultContact.title,

              subtitle:
                contactData.subtitle ||
                defaultContact.subtitle,

              description:
                contactData.description ||
                defaultContact.description,

              phone:
                contactData.phone ||
                defaultContact.phone,

              email:
                contactData.email ||
                defaultContact.email,

              address:
                contactData.address ||
                defaultContact.address,

              mapUrl:
                contactData.mapUrl ||
                defaultContact.mapUrl,
            });
          }
        }
      } catch (error) {
        console.error(
          "Failed to load Contact content:",
          error
        );
      }
    };

    loadContactContent();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    setFormMessage("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setFormError("");
    setFormMessage("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    // Name validation
    if (name.length < 2) {
      setFormError(
        "Please enter a valid name."
      );
      return;
    }

    if (name.length > 100) {
      setFormError(
        "Name must be less than 100 characters."
      );
      return;
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setFormError(
        "Please enter a valid email address."
      );
      return;
    }

    // Message validation
    if (message.length < 5) {
      setFormError(
        "Message must contain at least 5 characters."
      );
      return;
    }

    if (message.length > 2000) {
      setFormError(
        "Message must be less than 2000 characters."
      );
      return;
    }

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(
        "/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormError(
          data.message ||
            "Message send nahi ho paya."
        );
        return;
      }

      setFormMessage(
        "धन्यवाद 🙏 आपका संदेश सफलतापूर्वक भेज दिया गया है।"
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error
      );

      setFormError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <div className="logo-icon">ॐ</div>

            <div>
              <h2>श्री खाटू श्याम</h2>
              <span>मंदिर, अजमेर</span>
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

      {/* Hero */}
      <section className="page-hero">
        <div className="page-hero-overlay"></div>

        <div className="page-hero-content">
          <p className="welcome">
            🙏 जय श्री श्याम 🙏
          </p>

          <h1>{contact.title}</h1>

          <p>{contact.subtitle}</p>
        </div>
      </section>

      {/* Contact Intro */}
      <section className="contact-section">
        <div className="container">
          <p className="section-label">
            ॥ श्री श्याम ॥
          </p>

          <h2>{contact.title}</h2>

          <div className="gold-line"></div>

          <p className="contact-description">
            {contact.description}
          </p>

          {/* Contact Cards */}
          <div className="contact-info-grid">

            {/* Phone */}
            <div className="contact-info-card">
              <div className="contact-icon">
                📞
              </div>

              <h3>फोन</h3>

              <p>{contact.phone}</p>

              <div className="contact-actions">
                <a
                  href={`tel:${contact.phone}`}
                  className="contact-action primary-action"
                >
                  Call
                </a>

                <a
                  href={`https://wa.me/${contact.phone?.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-action secondary-action"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-info-card">
              <div className="contact-icon">
                📧
              </div>

              <h3>ईमेल</h3>

              <p>{contact.email}</p>

              <a
                href={`mailto:${contact.email}`}
                className="contact-action primary-action"
              >
                Email करें
              </a>
            </div>

            {/* Address */}
            <div className="contact-info-card">
              <div className="contact-icon">
                📍
              </div>

              <h3>पता</h3>

              <p>{contact.address}</p>

              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-action primary-action"
              >
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="container contact-form-container">

          <div className="contact-form-intro">
            <p className="section-label">
              हमसे जुड़ें
            </p>

            <h2>अपना संदेश भेजें</h2>

            <div className="gold-line"></div>

            <p>
              मंदिर से संबंधित किसी जानकारी या सुझाव
              के लिए नीचे दिया गया फॉर्म भरें।
            </p>

            <div className="contact-blessing">
              🙏 जय श्री श्याम 🙏
            </div>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">
                आपका नाम
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="अपना नाम लिखें"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                ईमेल
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="अपना ईमेल लिखें"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                संदेश
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="अपना संदेश लिखें..."
                value={formData.message}
                onChange={handleChange}
                maxLength={2000}
                disabled={isSubmitting}
                required
              ></textarea>

              <small className="message-character-count">
                {formData.message.length}/2000
              </small>
            </div>

            {/* Success Message */}
            {formMessage && (
              <div className="contact-success-message">
                ✅ {formMessage}
              </div>
            )}

            {/* Error Message */}
            {formError && (
              <div className="contact-error-message">
                ❌ {formError}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Message भेजा जा रहा है..."
                : "संदेश भेजें 🙏"}
            </button>
          </form>
        </div>
      </section>

      {/* Map */}
      <section className="contact-map-section">
        <div className="container">
          <p className="section-label">
            स्थान
          </p>

          <h2>मंदिर का स्थान</h2>

          <div className="gold-line"></div>

          <div className="map-container">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                contact.address || ""
              )}&output=embed`}
              loading="lazy"
              title="Shree Khatu Shyam Mandir Ajmer Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-container">
          <div>
            <h2>श्री खाटू श्याम मंदिर</h2>
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
          © 2026 श्री खाटू श्याम मंदिर, अजमेर
        </div>
      </footer>
    </main>
  );
}