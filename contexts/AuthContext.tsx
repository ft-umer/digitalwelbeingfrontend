import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: { email: string } | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await AsyncStorage.getItem('mock_session');
        if (session) setUser(JSON.parse(session));
      } catch (e) {
        console.warn('Error loading session', e);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('mock_users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      if (users.find((u: any) => u.email === email)) throw new Error('User already exists');

      users.push({ email, password });
      await AsyncStorage.setItem('mock_users', JSON.stringify(users));
      await AsyncStorage.setItem('mock_session', JSON.stringify({ email }));
      setUser({ email });
    } catch (e) {
      throw e;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const usersJson = await AsyncStorage.getItem('mock_users');
      const users = usersJson ? JSON.parse(usersJson) : [];
      const found = users.find((u: any) => u.email === email && u.password === password);
      if (!found) throw new Error('Invalid credentials');

      await AsyncStorage.setItem('mock_session', JSON.stringify({ email }));
      setUser({ email });
    } catch (e) {
      throw e;
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('mock_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
