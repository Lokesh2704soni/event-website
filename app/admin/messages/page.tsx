"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    try {
      const response = await fetch("/api/admin/messages");
      const data = await response.json();

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markAsRead = async (
    id: string,
    read: boolean
  ) => {
    try {
      const response = await fetch(
        "/api/admin/messages",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            read,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setMessages((previousMessages) =>
        previousMessages.map((item) =>
          item._id === id
            ? { ...item, read }
            : item
        )
      );
    } catch (error) {
      console.error("Update message error:", error);
      alert("Failed to update message");
    }
  };

  const deleteMessage = async (id: string) => {
    const confirmDelete = window.confirm(
      "क्या आप इस message को delete करना चाहते हैं?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        "/api/admin/messages",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete message");
        return;
      }

      setMessages((previousMessages) =>
        previousMessages.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Failed to delete message");
    }
  };

  const unreadCount = messages.filter(
    (message) => !message.read
  ).length;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <main className="messages-admin-page">

      {/* Header */}
      <header className="messages-admin-header">
        <div>
          <p className="admin-page-label">
            🙏 जय श्री श्याम
          </p>

          <h1>Contact Messages</h1>

          <p>
            Website visitors द्वारा भेजे गए messages
            यहाँ दिखाई देंगे।
          </p>
        </div>

        <div className="messages-header-actions">
          <button
            className="messages-back-button"
            onClick={() =>
              router.push("/admin/dashboard")
            }
          >
            ← Dashboard
          </button>

          <button
            className="messages-refresh-button"
            onClick={loadMessages}
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="messages-stats">
        <div className="message-stat-card">
          <div className="message-stat-icon">
            📩
          </div>

          <div>
            <span>Total Messages</span>
            <strong>{messages.length}</strong>
          </div>
        </div>

        <div className="message-stat-card unread-stat">
          <div className="message-stat-icon">
            🔴
          </div>

          <div>
            <span>Unread Messages</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="message-stat-card">
          <div className="message-stat-icon">
            ✅
          </div>

          <div>
            <span>Read Messages</span>
            <strong>
              {messages.length - unreadCount}
            </strong>
          </div>
        </div>
      </section>

      {/* Messages */}
      <section className="messages-list-section">

        <div className="messages-section-title">
          <div>
            <h2>Visitor Messages</h2>
            <p>
              यहाँ से messages को manage कर सकते हैं।
            </p>
          </div>
        </div>

        {loading ? (
          <div className="messages-empty">
            <div className="messages-loader">
              ⏳
            </div>

            <p>Messages loading...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="messages-empty">
            <div className="messages-empty-icon">
              📭
            </div>

            <h3>No Messages Yet</h3>

            <p>
              अभी तक किसी visitor ने contact form
              submit नहीं किया है।
            </p>
          </div>
        ) : (
          <div className="messages-list">

            {messages.map((item) => (
              <article
                key={item._id}
                className={`message-card ${
                  !item.read
                    ? "message-unread"
                    : ""
                }`}
              >

                {/* Message Header */}
                <div className="message-card-header">

                  <div className="message-user">
                    <div className="message-avatar">
                      {item.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h3>{item.name}</h3>

                      <a
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>
                    </div>
                  </div>

                  {!item.read && (
                    <span className="unread-badge">
                      NEW
                    </span>
                  )}
                </div>

                {/* Message Body */}
                <div className="message-body">
                  <p>{item.message}</p>
                </div>

                {/* Footer */}
                <div className="message-card-footer">

                  <span className="message-date">
                    🕐 {formatDate(item.createdAt)}
                  </span>

                  <div className="message-actions">

                    <a
                      href={`mailto:${item.email}?subject=Re: Your message to Shree Khatu Shyam Mandir`}
                      className="message-action reply-action"
                    >
                      📧 Reply
                    </a>

                    <button
                      className="message-action read-action"
                      onClick={() =>
                        markAsRead(
                          item._id,
                          !item.read
                        )
                      }
                    >
                      {item.read
                        ? "🔴 Mark Unread"
                        : "✅ Mark Read"}
                    </button>

                    <button
                      className="message-action delete-message-action"
                      onClick={() =>
                        deleteMessage(item._id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>
                </div>
              </article>
            ))}

          </div>
        )}
      </section>
    </main>
  );
}