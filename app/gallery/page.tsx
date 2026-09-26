"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ImageData = {
  url: string;
  publicId: string;
};

type Event = {
  _id: string;
  year: number;
  title: string;
  description: string;
  date: string;
  images?: ImageData[];
};

export default function Gallery() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox states
  const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Swipe states
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Gallery error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Group events by year
  const groupedEvents = events.reduce(
    (groups, event) => {
      if (!groups[event.year]) {
        groups[event.year] = [];
      }

      groups[event.year].push(event);

      return groups;
    },
    {} as Record<number, Event[]>
  );

  const years = Object.keys(groupedEvents)
    .map(Number)
    .sort((a, b) => b - a);

  // Open fullscreen gallery
  function openGallery(images: ImageData[], index: number) {
    setSelectedImages(images);
    setSelectedIndex(index);
  }

  // Close fullscreen gallery
  function closeGallery() {
    setSelectedImages([]);
    setSelectedIndex(0);
  }

  // Next image
  function showNext() {
    setSelectedIndex((current) => {
      if (current === selectedImages.length - 1) {
        return 0;
      }

      return current + 1;
    });
  }

  // Previous image
  function showPrevious() {
    setSelectedIndex((current) => {
      if (current === 0) {
        return selectedImages.length - 1;
      }

      return current - 1;
    });
  }

  // Keyboard controls
  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (selectedImages.length === 0) {
        return;
      }

      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [selectedImages.length]);

  // Mobile swipe
  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    setTouchEnd(null);
    setTouchStart(event.targetTouches[0].clientX);
  }

  function handleTouchMove(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    setTouchEnd(event.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStart === null || touchEnd === null) {
      return;
    }

    const distance = touchStart - touchEnd;

    // Minimum swipe distance
    const minSwipeDistance = 50;

    // Swipe left → next
    if (distance > minSwipeDistance) {
      showNext();
    }

    // Swipe right → previous
    if (distance < -minSwipeDistance) {
      showPrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }

  return (
    <main className="gallery-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="gallery-header">
        <div className="gallery-header-content">

          <p>🙏 जय श्री श्याम 🙏</p>

          <h1>कार्यक्रम एवं गैलरी</h1>

          <span>
            बाबा श्याम के पावन आयोजनों की सुंदर स्मृतियां
          </span>

        </div>
      </section>


      {/* =========================
          GALLERY
      ========================= */}

      <section className="years-section">

        <div className="container">

          <div className="gallery-title">

            <p className="section-label">
              हमारी स्मृतियां
            </p>

            <h2>
              वर्ष अनुसार कार्यक्रम
            </h2>

            <div className="gold-line"></div>

          </div>


          {/* Loading */}

          {loading && (
            <div className="gallery-loading">
              <p>🙏 गैलरी लोड हो रही है...</p>
            </div>
          )}


          {/* No events */}

          {!loading && events.length === 0 && (
            <div className="gallery-loading">
              <p>
                अभी कोई कार्यक्रम उपलब्ध नहीं है।
              </p>
            </div>
          )}


          {/* Years */}

          {!loading && events.length > 0 && (
            <div className="years-grid">

              {years.map((year) => (

                <div
                  className="year-card"
                  key={year}
                >

                  {/* Year */}

                  <div className="year-number">
                    {year}
                  </div>


                  {/* Event List */}

                  <div className="event-list">

                    {groupedEvents[year].map(
                      (event) => (

                        <div
                          className="event-item"
                          key={event._id}
                        >

                          <div className="event-item-content">

                            <span className="event-icon">
                              📸
                            </span>

                            <div>

                              <strong>
                                {event.title}
                              </strong>

                              {event.date && (
                                <small>
                                  📅 {event.date}
                                </small>
                              )}

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  {/* Event Galleries */}

                  {groupedEvents[year].map(
                    (event) => (

                      <div
                        className="public-event-gallery"
                        key={event._id}
                      >

                        <h3>
                          {event.title}
                        </h3>


                        {event.description && (
                          <p>
                            {event.description}
                          </p>
                        )}


                        {/* Photos */}

                        {event.images &&
                        event.images.length > 0 ? (

                          <div className="public-images-grid">

                            {event.images.map(
                              (image, index) => (

                                <img
                                  key={
                                    image.publicId ||
                                    index
                                  }
                                  src={image.url}
                                  alt={event.title}
                                  loading="lazy"

                                  onClick={() =>
                                    openGallery(
                                      event.images || [],
                                      index
                                    )
                                  }
                                />

                              )
                            )}

                          </div>

                        ) : (

                          <p className="no-event-images">
                            अभी इस कार्यक्रम की तस्वीरें
                            उपलब्ध नहीं हैं।
                          </p>

                        )}

                      </div>

                    )
                  )}

                </div>

              ))}

            </div>
          )}

        </div>

      </section>


      {/* =========================
          FULLSCREEN LIGHTBOX
      ========================= */}

      {selectedImages.length > 0 && (

        <div
          className="gallery-lightbox"

          onClick={closeGallery}

          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >

          {/* Close */}

          <button
            className="lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              closeGallery();
            }}
          >
            ✕
          </button>


          {/* Previous */}

          <button
            className="lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
          >
            ‹
          </button>


          {/* Image */}

          <div
            className="lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={
                selectedImages[selectedIndex].url
              }
              alt="Temple Gallery"
            />

            <div className="lightbox-counter">

              {selectedIndex + 1}
              {" / "}
              {selectedImages.length}

            </div>

          </div>


          {/* Next */}

          <button
            className="lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
          >
            ›
          </button>

        </div>

      )}


      {/* =========================
          FOOTER
      ========================= */}

      <footer>

        <div className="container footer-container">

          <div>

            <h2>
              श्री खाटू श्याम मंदिर
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

          © 2026 श्री खाटू श्याम मंदिर, अजमेर

        </div>

      </footer>

    </main>
  );
}