import { useState, useEffect } from "react";
import { db, auth } from "../component/Firebase"; // Ensure correct Firebase import
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [fullName, setFullName] = useState(""); // Full Name field
  const [phone, setPhone] = useState(""); // Phone field
  const [email, setEmail] = useState(""); // Email
  const [userExists, setUserExists] = useState(false); // Flag to track user existence
  const navigate = useNavigate();

  // Load user data when component mounts
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email);
      loadUserData(user.uid); // Load user data if authenticated
    }
  }, []);

  // Load user data from Firestore
  const loadUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setFullName(userData.fullName || ""); // Load existing full name
        setPhone(userData.phone || "");
        setUserExists(true); // Set to true if user data exists
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("User is not authenticated.");
      return;
    }

    // Check if user already has a profile saved
    if (userExists) {
      try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            fullName,
            phone,
            updatedAt: serverTimestamp(),
          },
          { merge: true } // Merge the new data with existing data
        );

        alert("Profile Updated Successfully!");
        navigate("/admin");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Error saving profile, check console for details.");
      }
    } else {
      alert("No profile found. Please register first.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CompleteProfile;
