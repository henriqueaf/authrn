import React, {useState, createContext, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import * as authService from '../services/auth';
import api from '../services/api';

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function setApiHeaderToken(token: string): void {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      AsyncStorage.multiGet(['@RNAuth:user', '@RNAuth:token']).then(
        (response) => {
          const storagedUser = response[0][1];
          const storagedToken = response[1][1];

          setTimeout(() => {
            if (storagedUser && storagedToken) {
              setUser(JSON.parse(storagedUser));
              setLoading(false);
              setApiHeaderToken(storagedToken);
            }
          }, 2000);
        },
      );
    }

    loadStorageData();
  }, []);

  async function signIn() {
    const response = await authService.signIn();

    setUser(response.user);
    setApiHeaderToken(response.token);

    await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@RNAuth:token', response.token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  const authProviderDefaultValues: AuthContextData = {
    signed: !!user,
    user,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={authProviderDefaultValues}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);

  return context;
}
