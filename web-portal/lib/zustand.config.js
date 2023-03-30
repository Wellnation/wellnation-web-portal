import { create } from 'zustand';
import { auth } from './firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { useQuery } from 'react-query';

const useStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading })
}));

function useAuth() {
  const setUser = useStore(state => state.setUser);

  useQuery('auth', () => new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
      resolve(user);
    });
    return unsubscribe;
  }));

  return useStore(state => state.user);
}

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false });
});

export { useAuth };