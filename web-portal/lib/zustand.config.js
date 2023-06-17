import { create } from 'zustand';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

const useAuth = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

const useLoad = create((set) => ({
  load: true,
  setLoad: (load) => set({ load }),
}));

const useNavbarState = create((set) => ({
  render: true,
  setRender: (render) => set({ render }),
}));

onAuthStateChanged(auth, (user) => {
  useAuth.setState({ user, loading: false });
}, (error) => {
  useAuth.setState({ error, loading: false });
});

const useAdminMode = create((set) => ({
  adminMode: false,
  setAdminMode: (adminMode) => set({ adminMode }),
}));

export { useAuth, useLoad, useNavbarState, useAdminMode };
