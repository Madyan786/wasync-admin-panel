import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'adminUsers');
      const querySnapshot = await getDocs(usersRef);
      const usersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (err) {
      setError('Failed to load users');
      console.error('Users error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role || 'admin'}</TableCell>
                <TableCell>{user.enabled ? 'Active' : 'Disabled'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && !loading && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No users found
        </Typography>
      )}
    </Box>
  );
}
