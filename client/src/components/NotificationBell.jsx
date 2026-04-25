import { useEffect, useState } from "react";
import API from "../api/axios";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={styles.wrapper}>
      {/* Bell Icon */}
      <div onClick={() => setOpen(!open)} style={styles.bellWrapper}>
        <span style={styles.bell}>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={styles.markAllBtn}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p style={styles.empty}>No notifications yet</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleMarkRead(n._id)}
                style={{
                  ...styles.notifItem,
                  backgroundColor: n.isRead ? "#fff" : "#ebf8ff",
                }}
              >
                <p style={styles.notifMessage}>{n.message}</p>
                <p style={styles.notifTime}>
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { position: "relative" },
  bellWrapper: { cursor: "pointer", position: "relative", display: "inline-block" },
  bell: { fontSize: "22px" },
  badge: {
    position: "absolute", top: "-6px", right: "-8px",
    backgroundColor: "#fc8181", color: "#fff",
    fontSize: "10px", fontWeight: "bold",
    borderRadius: "50%", width: "16px", height: "16px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  dropdown: {
    position: "absolute", right: 0, top: "36px",
    backgroundColor: "#fff", borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    width: "300px", zIndex: 1000,
    maxHeight: "380px", overflowY: "auto",
  },
  dropdownHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
  },
  dropdownTitle: { fontWeight: "bold", fontSize: "14px" },
  markAllBtn: {
    fontSize: "12px", color: "#4299e1",
    background: "none", border: "none", cursor: "pointer",
  },
  notifItem: {
    padding: "10px 16px",
    borderBottom: "1px solid #e2e8f0",
    cursor: "pointer",
  },
  notifMessage: { fontSize: "13px", color: "#2d3748", margin: "0 0 4px" },
  notifTime: { fontSize: "11px", color: "#a0aec0", margin: 0 },
  empty: { padding: "1rem", textAlign: "center", color: "#a0aec0", fontSize: "13px" },
};

export default NotificationBell;