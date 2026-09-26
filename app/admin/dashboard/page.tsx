"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  _id: string;
  read: boolean;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadUnreadMessages = async () => {
      try {
        const response = await fetch(
          "/api/admin/messages"
        );

        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }

        const data = await response.json();

        if (data.success) {
          const unread = (data.messages as Message[]).filter(
            (message) => !message.read
          ).length;

          setUnreadMessages(unread);
        }
      } catch (error) {
        console.error(
          "Failed to load messages:",
          error
        );
      }
    };

    loadUnreadMessages();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/admin/login");
    }
  };

  return (
    <main className="admin-dashboard">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            श्री खाटू श्याम मंदिर, अजमेर
          </p>
        </div>

        <button
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Welcome */}
      <section className="admin-welcome">
        <div>
          <span>🙏</span>

          <h2>जय श्री श्याम</h2>

          <p>
            Welcome to the temple administration panel.
            यहाँ से आप मंदिर की website का content और
            gallery manage कर सकेंगे।
          </p>
        </div>
      </section>

      {/* Admin Cards */}
      <section className="admin-cards">

        {/* Events */}
        <div className="admin-card">
          <div className="admin-card-icon">
            📅
          </div>

          <h3>Events</h3>

          <p>
            Add, edit and manage yearly temple events.
          </p>

          <button
            onClick={() =>
              router.push("/admin/events")
            }
          >
            Manage Events
          </button>
        </div>

        {/* Gallery */}
        <div className="admin-card">
          <div className="admin-card-icon">
            🖼️
          </div>

          <h3>Gallery</h3>

          <p>
            Manage event photos and year-wise gallery.
          </p>

          <button
            onClick={() =>
              router.push("/admin/events")
            }
          >
            Manage Gallery
          </button>
        </div>

        {/* Website Content */}
        <div className="admin-card">
          <div className="admin-card-icon">
            📝
          </div>

          <h3>Website Content</h3>

          <p>
            Update Home, About and Contact information.
          </p>

          <button
            onClick={() =>
              router.push("/admin/content")
            }
          >
            Edit Content
          </button>
        </div>

        {/* Messages */}
        <div className="admin-card messages-dashboard-card">
          <div className="admin-card-icon">
            📩
          </div>

          <div className="messages-card-title">
            <h3>Messages</h3>

            {unreadMessages > 0 && (
              <span className="dashboard-message-badge">
                {unreadMessages}
              </span>
            )}
          </div>

          <p>
            Website visitors द्वारा भेजे गए contact
            messages देखें और manage करें।
          </p>

          <button
            onClick={() =>
              router.push("/admin/messages")
            }
          >
            View Messages
          </button>
        </div>

        {/* Settings */}
        <div className="admin-card">
          <div className="admin-card-icon">
            ⚙️
          </div>

          <h3>Settings</h3>

          <p>
            Manage admin and website settings.
          </p>

          <button
            onClick={() =>
              alert(
                "Settings section will be available soon."
              )
            }
          >
            Settings
          </button>
        </div>

      </section>
    </main>
  );
}