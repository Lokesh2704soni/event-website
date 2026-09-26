"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ImageData = {
    url: string;
    publicId: string;
    createdAt: string;
};

type Event = {
    _id: string;
    year: number;
    title: string;
    description: string;
    date: string;
    images?: ImageData[];
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);

    // =========================
    // ADD EVENT
    // =========================

    const [year, setYear] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");

    // =========================
    // EDIT EVENT
    // =========================

    const [editingId, setEditingId] = useState("");
    const [editYear, setEditYear] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDate, setEditDate] = useState("");

    // =========================
    // GENERAL STATES
    // =========================

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // =========================
    // UPLOAD
    // =========================

    const [uploadingEventId, setUploadingEventId] = useState("");
    const [uploadMessage, setUploadMessage] = useState("");

    const fileInputRefs = useRef<{
        [key: string]: HTMLInputElement | null;
    }>({});

    // =========================
    // LOAD EVENTS
    // =========================

    async function loadEvents() {
        try {
            const response = await fetch("/api/admin/events");
            const data = await response.json();

            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error("Load events error:", error);
        }
    }

    useEffect(() => {
        loadEvents();
    }, []);

    // =========================
    // ADD EVENT
    // =========================

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/admin/events",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        year,
                        title,
                        description,
                        date,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to add event"
                );
                return;
            }

            setMessage(
                "Event added successfully 🙏"
            );

            setYear("");
            setTitle("");
            setDescription("");
            setDate("");

            await loadEvents();
        } catch (error) {
            console.error(
                "Add event error:",
                error
            );

            setMessage(
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // START EDIT
    // =========================

    function startEdit(event: Event) {
        setEditingId(event._id);
        setEditYear(String(event.year));
        setEditTitle(event.title);
        setEditDescription(
            event.description || ""
        );
        setEditDate(event.date || "");
        setMessage("");
    }

    // =========================
    // CANCEL EDIT
    // =========================

    function cancelEdit() {
        setEditingId("");
        setEditYear("");
        setEditTitle("");
        setEditDescription("");
        setEditDate("");
    }

    // =========================
    // SAVE EDIT
    // =========================

    async function handleEdit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/admin/events",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: editingId,
                        year: editYear,
                        title: editTitle,
                        description:
                            editDescription,
                        date: editDate,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to update event"
                );
                return;
            }

            setMessage(
                "Event updated successfully 🙏"
            );

            cancelEdit();

            await loadEvents();
        } catch (error) {
            console.error(
                "Edit event error:",
                error
            );

            setMessage(
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // DELETE EVENT
    // =========================

    async function handleDelete(
        eventId: string
    ) {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/admin/events",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        id: eventId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to delete event"
                );
                return;
            }

            setMessage(
                "Event deleted successfully 🙏"
            );

            await loadEvents();
        } catch (error) {
            console.error(
                "Delete event error:",
                error
            );

            setMessage(
                "Something went wrong while deleting event"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // DELETE PHOTO
    // =========================

    async function handleDeletePhoto(
        eventId: string,
        publicId: string
    ) {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this photo?"
            );

        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "/api/admin/gallery/delete",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        eventId,
                        publicId,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setMessage(
                    data.message ||
                        "Failed to delete photo"
                );
                return;
            }

            setMessage(
                "Photo deleted successfully 🙏"
            );

            await loadEvents();
        } catch (error) {
            console.error(
                "Delete photo error:",
                error
            );

            setMessage(
                "Something went wrong while deleting photo"
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // IMAGE UPLOAD
    // =========================

    async function handleImageUpload(
        eventId: string,
        files: FileList | null
    ) {
        if (!files || files.length === 0) {
            return;
        }

        setUploadingEventId(eventId);
        setUploadMessage("");

        try {
            for (const file of Array.from(
                files
            )) {
                const formData =
                    new FormData();

                formData.append(
                    "file",
                    file
                );

                formData.append(
                    "eventId",
                    eventId
                );

                const response =
                    await fetch(
                        "/api/admin/gallery/upload",
                        {
                            method: "POST",
                            body: formData,
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    !data.success
                ) {
                    setUploadMessage(
                        data.message ||
                            "Image upload failed"
                    );
                    return;
                }
            }

            setUploadMessage(
                "Photos uploaded successfully 🙏"
            );

            await loadEvents();
        } catch (error) {
            console.error(
                "Upload error:",
                error
            );

            setUploadMessage(
                "Something went wrong while uploading"
            );
        } finally {
            setUploadingEventId("");
        }
    }

    return (
        <main className="events-admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="events-admin-header">

                <div>
                    <h1>
                        Events Management
                    </h1>

                    <p>
                        Manage yearly temple
                        events and photos
                    </p>
                </div>

                <a href="/admin/dashboard">
                    ← Dashboard
                </a>

            </div>


            {/* =========================
                ADD EVENT
            ========================= */}

            <section className="event-form-card">

                <h2>
                    Add New Event
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="event-form-grid">

                        <div>
                            <label>
                                Year
                            </label>

                            <input
                                type="number"
                                placeholder="2026"
                                value={year}
                                onChange={(e) =>
                                    setYear(
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>


                        <div>
                            <label>
                                Event Date
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                    </div>


                    <div>
                        <label>
                            Event Title
                        </label>

                        <input
                            type="text"
                            placeholder="Janmashtami Mahotsav"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            required
                        />
                    </div>


                    <div>
                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Enter event description..."
                            value={
                                description
                            }
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            rows={4}
                        />
                    </div>


                    {message && (
                        <p className="event-form-message">
                            {message}
                        </p>
                    )}


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : "➕ Add Event"}
                    </button>

                </form>

            </section>


            {/* =========================
                EXISTING EVENTS
            ========================= */}

            <section className="events-list-section">

                <h2>
                    Existing Events
                </h2>


                {events.length === 0 ? (

                    <p>
                        No events added yet.
                    </p>

                ) : (

                    <div className="events-list">

                        {events.map(
                            (event) => (

                                <div
                                    className="event-admin-card"
                                    key={
                                        event._id
                                    }
                                >

                                    {/* =====================
                                        EDIT MODE
                                    ===================== */}

                                    {editingId ===
                                    event._id ? (

                                        <form
                                            onSubmit={
                                                handleEdit
                                            }
                                            className="event-edit-form"
                                        >

                                            <h3>
                                                Edit Event
                                            </h3>


                                            <div className="event-form-grid">

                                                <div>
                                                    <label>
                                                        Year
                                                    </label>

                                                    <input
                                                        type="number"
                                                        value={
                                                            editYear
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setEditYear(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>


                                                <div>
                                                    <label>
                                                        Event Date
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={
                                                            editDate
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setEditDate(
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>

                                            </div>


                                            <div>
                                                <label>
                                                    Event Title
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        editTitle
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEditTitle(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>


                                            <div>
                                                <label>
                                                    Description
                                                </label>

                                                <textarea
                                                    value={
                                                        editDescription
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setEditDescription(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    rows={4}
                                                />
                                            </div>


                                            <div className="event-action-buttons">

                                                <button
                                                    type="submit"
                                                    disabled={
                                                        loading
                                                    }
                                                    className="save-edit-button"
                                                >
                                                    💾 Save Changes
                                                </button>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        cancelEdit
                                                    }
                                                    className="cancel-edit-button"
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </form>

                                    ) : (

                                        /* =====================
                                            NORMAL EVENT
                                        ===================== */

                                        <div>

                                            <span>
                                                {
                                                    event.year
                                                }
                                            </span>


                                            <h3>
                                                {
                                                    event.title
                                                }
                                            </h3>


                                            {event.date && (
                                                <p>
                                                    📅{" "}
                                                    {
                                                        event.date
                                                    }
                                                </p>
                                            )}


                                            {event.description && (
                                                <p>
                                                    {
                                                        event.description
                                                    }
                                                </p>
                                            )}


                                            {/* ACTION BUTTONS */}

                                            <div className="event-action-buttons">

                                                <button
                                                    type="button"
                                                    className="edit-event-button"
                                                    onClick={() =>
                                                        startEdit(
                                                            event
                                                        )
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>


                                                <button
                                                    type="button"
                                                    className="delete-event-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            event._id
                                                        )
                                                    }
                                                    disabled={
                                                        loading
                                                    }
                                                >
                                                    🗑️ Delete
                                                </button>

                                            </div>


                                            {/* =====================
                                                UPLOAD PHOTOS
                                            ===================== */}

                                            <div className="event-upload-section">

                                                <input
                                                    ref={(
                                                        element
                                                    ) => {
                                                        fileInputRefs.current[
                                                            event._id
                                                        ] =
                                                            element;
                                                    }}
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    hidden
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleImageUpload(
                                                            event._id,
                                                            e
                                                                .target
                                                                .files
                                                        )
                                                    }
                                                />


                                                <button
                                                    type="button"
                                                    className="upload-photo-button"
                                                    onClick={() =>
                                                        fileInputRefs
                                                            .current[
                                                            event._id
                                                        ]?.click()
                                                    }
                                                    disabled={
                                                        uploadingEventId ===
                                                        event._id
                                                    }
                                                >
                                                    {uploadingEventId ===
                                                    event._id
                                                        ? "Uploading..."
                                                        : "📸 Upload Photos"}
                                                </button>


                                                {uploadMessage &&
                                                    uploadingEventId ===
                                                        "" && (
                                                        <p className="upload-success-message">
                                                            {
                                                                uploadMessage
                                                            }
                                                        </p>
                                                    )}

                                            </div>


                                            {/* =====================
                                                SHOW PHOTOS
                                            ===================== */}

                                            {event.images &&
                                                event.images
                                                    .length >
                                                    0 && (

                                                    <div className="event-images-grid">

                                                        {event.images.map(
                                                            (
                                                                image,
                                                                index
                                                            ) => (

                                                                <div
                                                                    className="admin-image-card"
                                                                    key={
                                                                        image.publicId ||
                                                                        index
                                                                    }
                                                                >

                                                                    <img
                                                                        src={
                                                                            image.url
                                                                        }
                                                                        alt={
                                                                            event.title
                                                                        }
                                                                    />


                                                                    <button
                                                                        type="button"
                                                                        className="admin-image-delete"
                                                                        onClick={() =>
                                                                            handleDeletePhoto(
                                                                                event._id,
                                                                                image.publicId
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            loading
                                                                        }
                                                                        title="Delete photo"
                                                                    >
                                                                        🗑️
                                                                    </button>

                                                                </div>

                                                            )
                                                        )}

                                                    </div>

                                                )}

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </main>
    );
}