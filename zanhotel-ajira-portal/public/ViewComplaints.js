import React, { useEffect, useState } from "react";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [resolved, setResolved] = useState({});

  useEffect(() => {
    const dummyComplaints = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        message: "Nimekumbwa na tatizo la kudanganywa kuhusu kazi.",
        fileUrl: "/uploads/proof1.png",
        isResolved: false,
      },
      {
        id: 2,
        name: "Asha Mwinyi",
        email: "asha@example.com",
        message: "Sijaweza ku-upload vyeti vyangu.",
        fileUrl: null,
        isResolved: false,
      },
    ];
    setComplaints(dummyComplaints);
  }, []);

  const handleReply = (id) => {
    const reply = replyText[id];
    if (reply) {
      alert(`Reply sent for complaint ID ${id}: ${reply}`);
      setReplyText({ ...replyText, [id]: "" });
      // TODO: send to backend
    }
  };

  const handleMarkResolved = (id) => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, isResolved: true } : c
    );
    setComplaints(updated);
    setResolved({ ...resolved, [id]: true });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      const updated = complaints.filter((c) => c.id !== id);
      setComplaints(updated);
      // TODO: send delete request to backend
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((complaint) => (
          <div key={complaint.id} style={styles.card}>
            <p><strong>Name:</strong> {complaint.name}</p>
            <p><strong>Email:</strong> {complaint.email}</p>
            <p><strong>Message:</strong> {complaint.message}</p>
            {complaint.fileUrl ? (
              <a
                href={complaint.fileUrl}
                download
                style={styles.downloadLink}
              >
                Download Attachment
              </a>
            ) : (
              <p>No file uploaded</p>
            )}
            <div style={{ marginTop: "10px" }}>
              <textarea
                style={styles.textarea}
                placeholder="Write a reply..."
                value={replyText[complaint.id] || ""}
                onChange={(e) =>
                  setReplyText({ ...replyText, [complaint.id]: e.target.value })
                }
              />
              <button
                onClick={() => handleReply(complaint.id)}
                style={styles.button}
              >
                Send Reply
              </button>
              {!complaint.isResolved && (
                <button
                  onClick={() => handleMarkResolved(complaint.id)}
                  style={{ ...styles.button, backgroundColor: "#28a745" }}
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => handleDelete(complaint.id)}
                style={{ ...styles.button, backgroundColor: "#dc3545" }}
              >
                Delete
              </button>
              {complaint.isResolved && (
                <p style={{ color: "green", marginTop: "8px" }}>
                  ✅ Marked as Resolved
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#f1f1f1",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  downloadLink: {
    display: "inline-block",
    marginTop: "10px",
    color: "#007bff",
    textDecoration: "underline",
  },
  textarea: {
    width: "100%",
    height: "60px",
    marginTop: "10px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    marginTop: "10px",
    marginRight: "10px",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ViewComplaints;
