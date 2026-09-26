"use client";

import { useEffect, useState } from "react";

type Content = {
    section: string;
    title: string;
    subtitle: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    mapUrl: string;
};

const emptyContent: Content = {
    section: "",
    title: "",
    subtitle: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    mapUrl: "",
};

export default function ContentPage() {
    const [activeSection, setActiveSection] =
        useState("home");

    const [content, setContent] =
        useState<Content>(emptyContent);

    const [loading, setLoading] =
        useState(false);

    const [pageLoading, setPageLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    // =========================
    // LOAD CONTENT
    // =========================

    async function loadContent(
        section: string
    ) {
        setPageLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/admin/content"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to load content"
                );
                return;
            }

            const selectedContent =
                data.content.find(
                    (item: Content) =>
                        item.section === section
                );

            if (selectedContent) {
                setContent(selectedContent);
            } else {
                setContent({
                    ...emptyContent,
                    section,
                });
            }
        } catch (error) {
            console.error(
                "Load content error:",
                error
            );

            setMessage(
                "Something went wrong"
            );
        } finally {
            setPageLoading(false);
        }
    }

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        loadContent(activeSection);
    }, [activeSection]);

    // =========================
    // INPUT CHANGE
    // =========================

    function handleChange(
        field: keyof Content,
        value: string
    ) {
        setContent((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    // =========================
    // SAVE CONTENT
    // =========================

    async function handleSave() {
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/admin/content",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        ...content,
                        section: activeSection,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to save content"
                );
                return;
            }

            setMessage(
                "Content updated successfully 🙏"
            );
        } catch (error) {
            console.error(
                "Save content error:",
                error
            );

            setMessage(
                "Something went wrong while saving"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="content-admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="content-admin-header">

                <div>
                    <h1>
                        Website Content
                    </h1>

                    <p>
                        Manage your temple
                        website content
                    </p>
                </div>

                <a href="/admin/dashboard">
                    ← Dashboard
                </a>

            </div>


            {/* =========================
                SECTION TABS
            ========================= */}

            <div className="content-tabs">

                <button
                    className={
                        activeSection === "home"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSection(
                            "home"
                        )
                    }
                >
                    🏠 Home
                </button>

                <button
                    className={
                        activeSection === "about"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSection(
                            "about"
                        )
                    }
                >
                    📖 About
                </button>

                <button
                    className={
                        activeSection ===
                        "contact"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setActiveSection(
                            "contact"
                        )
                    }
                >
                    📞 Contact
                </button>

            </div>


            {/* =========================
                CONTENT FORM
            ========================= */}

            <section className="content-form-card">

                <div className="content-form-title">

                    <span>
                        {activeSection ===
                            "home" && "🏠"}

                        {activeSection ===
                            "about" && "📖"}

                        {activeSection ===
                            "contact" && "📞"}
                    </span>

                    <div>
                        <h2>
                            {activeSection
                                .charAt(0)
                                .toUpperCase() +
                                activeSection.slice(
                                    1
                                )}{" "}
                            Page
                        </h2>

                        <p>
                            Update your{" "}
                            {activeSection} page
                            content
                        </p>
                    </div>

                </div>


                {pageLoading ? (

                    <div className="content-loading">
                        <p>
                            🙏 Loading content...
                        </p>
                    </div>

                ) : (

                    <>

                        {/* TITLE */}

                        <div className="content-field">

                            <label>
                                Main Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter main title"
                                value={
                                    content.title
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "title",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* SUBTITLE */}

                        <div className="content-field">

                            <label>
                                Subtitle
                            </label>

                            <input
                                type="text"
                                placeholder="Enter subtitle"
                                value={
                                    content.subtitle
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "subtitle",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="content-field">

                            <label>
                                Description
                            </label>

                            <textarea
                                rows={6}
                                placeholder="Enter page description"
                                value={
                                    content.description
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CONTACT FIELDS */}

                        {activeSection ===
                            "contact" && (
                            <>

                                <div className="content-field">

                                    <label>
                                        Phone Number
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={
                                            content.phone
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            handleChange(
                                                "phone",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="content-field">

                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="temple@example.com"
                                        value={
                                            content.email
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            handleChange(
                                                "email",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="content-field">

                                    <label>
                                        Address
                                    </label>

                                    <textarea
                                        rows={3}
                                        placeholder="Temple address"
                                        value={
                                            content.address
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            handleChange(
                                                "address",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                </div>


                                <div className="content-field">

                                    <label>
                                        Google Maps URL
                                    </label>

                                    <input
                                        type="url"
                                        placeholder="https://maps.google.com/..."
                                        value={
                                            content.mapUrl
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            handleChange(
                                                "mapUrl",
                                                e.target
                                                    .value
                                            )
                                        }
                                    />

                                </div>

                            </>
                        )}


                        {/* MESSAGE */}

                        {message && (
                            <div className="content-message">
                                {message}
                            </div>
                        )}


                        {/* SAVE */}

                        <button
                            className="content-save-button"
                            onClick={
                                handleSave
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "💾 Save Changes"}
                        </button>

                    </>
                )}

            </section>

        </main>
    );
}