import { create } from 'zustand';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading })

}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});

export { useAuthStore };