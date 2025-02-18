import React, { useEffect, useState } from "react";
import { db } from "../component/Firebase"; // Import your Firebase configuration
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
} from "firebase/firestore";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Pagination,
} from "@mui/material";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastVisible, setLastVisible] = useState(null); // For pagination
  const [page, setPage] = useState(1); // To track current page
  const [totalPages, setTotalPages] = useState(0); // To track total pages

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        let q = query(usersRef, limit(5)); // Limit 5 users per page

        if (page > 1 && lastVisible) {
          q = query(usersRef, limit(5), startAfter(lastVisible)); // Fetch the next set of 5 users
        }

        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);

        // Set the last document for pagination
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        // Calculate the total pages dynamically based on the total number of users
        const totalUsersQuery = await getDocs(collection(db, "users"));
        const totalUsersCount = totalUsersQuery.size;
        setTotalPages(Math.ceil(totalUsersCount / 5)); // Calculate total pages
      } catch (err) {
        setError("Error fetching users: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
    return date.toLocaleString(); // Format it as a readable string
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ paddingTop: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h5" align="center" gutterBottom>
          Users List
        </Typography>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <ListItemText
                primary={`Name: ${user.fullName}`}
                secondary={`Email: ${user.email} | Phone: ${
                  user.phone
                } | Registered: ${formatTimestamp(user.createdAt)}`}
              />
            </ListItem>
          ))}
        </List>

        {/* Display pagination only if there are more than 5 users */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            variant="outlined"
            shape="rounded"
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          />
        )}
      </Paper>
    </Container>
  );
};

export default Admin;
