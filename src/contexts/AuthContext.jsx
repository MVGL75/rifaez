
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true, // same as fetch's credentials: 'include'
});
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [appError, setAppError] = useState(null)
  const [popError, setPopError] = useState(null)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async ({ username, password }) => {
    try {
      const res = await api.post('/login', { username, password });
      if (res.data.status === 200) {
        setUser(res.data.user);
        return navigate('/');
      }
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Login failed' };
    }
  };
  
  const logout = async () => {
    try {
      const res = await api.post('/logout');
      setUser(null);
      navigate('/login');
      setMessage(res.data.message || res.data.error);
    } catch (err) {
      setMessage('Logout failed');
    }
  };
  
  const register = async ({ name, email, password }) => {
    try {
      const res = await api.post('/register', { name, email, password });
      if (res.data.status === 201) {
        setUser(res.data.user);
        navigate('/');
      }
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Registration failed' };
    }
  };

  const connectDomain = async (domain) => {
    try {
      const res = await api.post('/api/domains', {domain, userId: user._id});
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Connection failed' };
    }
  };

  const verifyDomain = async (domain) => {
    try {
      const res = await api.post('/api/domains/verify', {domain});
      console.log(res)
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Connection failed' };
    }
  };

  const verifyCNAME = async (domain) => {
    try {
      console.log("try c")
      const res = await api.post('/api/domains/verify/cname', {domain});
      console.log(res, "CNAME")
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Connection failed' };
    }
  };
  
  const save = async (user) => {
    try {
      const res = await api.post('/save_settings', user);
      return res.data;
    } catch (err) {
      return { error: err.response?.data?.message || 'Save failed' };
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, save, setUser, connectDomain, verifyDomain, verifyCNAME, appError, setAppError, popError, setPopError}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
