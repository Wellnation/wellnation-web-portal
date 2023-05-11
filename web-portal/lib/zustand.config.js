import { create } from 'zustand';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { io } from 'socket.io-client';

const useAuth = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

onAuthStateChanged(auth, (user) => {
  useAuth.setState({ user, loading: false });
}, (error) => {
  useAuth.setState({ error, loading: false });
});

// zustand object for socket connection storing the io object
const useSocket = create((set) => ({
  io: null,
  setIo: (io) => set({ io }),
}));

useSocket.setState({ io: io('http://localhost:8001') });

export { useAuth, useSocket };
