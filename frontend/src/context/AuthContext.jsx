import React, { createContext, useState, useContext } from 'react';
import axios from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (email, username, password) => {
    const response = await axios.post('/auth/register', { email, username, password });
    login(response.data);
  };

  const performLogin = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    login(response.data);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, performLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);