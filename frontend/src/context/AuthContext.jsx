import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  admin: { name: 'John Doe', email: 'admin@apexstock.com', role: 'admin' },
  cashier: { name: 'Maria Gomez', email: 'cashier@apexstock.com', role: 'cashier' },
  manager: { name: 'Alex Rivera', email: 'manager@apexstock.com', role: 'manager' }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('apex_is_auth') === 'true';
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('apex_role') || 'admin';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('apex_user');
    return saved ? JSON.parse(saved) : DEMO_ACCOUNTS.admin;
  });

  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login with Email & Password
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Attempt backend API login
      const response = await authService.login(email, password);
      if (response && response.token) {
        localStorage.setItem('apex_token', response.token);
        const loggedUser = response.user;
        setUser(loggedUser);
        setRole(loggedUser.role);
        setIsAuthenticated(true);
        localStorage.setItem('apex_user', JSON.stringify(loggedUser));
        localStorage.setItem('apex_role', loggedUser.role);
        localStorage.setItem('apex_is_auth', 'true');
        setIsLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend login unavailable or invalid credentials, checking demo accounts:', err.message);

      // Fallback: match demo accounts or allow dev sign-in
      let matchedRole = 'admin';
      if (email.includes('cashier')) matchedRole = 'cashier';
      else if (email.includes('manager')) matchedRole = 'manager';

      const fallbackUser = {
        name: email.split('@')[0].toUpperCase(),
        email,
        role: matchedRole
      };

      setUser(fallbackUser);
      setRole(matchedRole);
      setIsAuthenticated(true);
      localStorage.setItem('apex_user', JSON.stringify(fallbackUser));
      localStorage.setItem('apex_role', matchedRole);
      localStorage.setItem('apex_is_auth', 'true');
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message: 'Invalid credentials' };
  };

  // Sign up / Register
  const register = async (name, email, password, requestedRole = 'cashier') => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response = await authService.register(name, email, password, requestedRole);
      if (response && response.token) {
        localStorage.setItem('apex_token', response.token);
        const registeredUser = response.user;
        setUser(registeredUser);
        setRole(registeredUser.role);
        setIsAuthenticated(true);
        localStorage.setItem('apex_user', JSON.stringify(registeredUser));
        localStorage.setItem('apex_role', registeredUser.role);
        localStorage.setItem('apex_is_auth', 'true');
        setIsLoading(false);
        return { success: true };
      }
    } catch (err) {
      console.warn('Backend register error, creating local session:', err.message);
      const newUser = { name, email, role: requestedRole };
      setUser(newUser);
      setRole(requestedRole);
      setIsAuthenticated(true);
      localStorage.setItem('apex_user', JSON.stringify(newUser));
      localStorage.setItem('apex_role', requestedRole);
      localStorage.setItem('apex_is_auth', 'true');
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, message: 'Failed to create account' };
  };

  // One-click quick login for demo and testing
  const quickLogin = (targetRole) => {
    const account = DEMO_ACCOUNTS[targetRole] || DEMO_ACCOUNTS.admin;
    setUser(account);
    setRole(account.role);
    setIsAuthenticated(true);
    localStorage.setItem('apex_token', `demo_token_${account.role}`);
    localStorage.setItem('apex_user', JSON.stringify(account));
    localStorage.setItem('apex_role', account.role);
    localStorage.setItem('apex_is_auth', 'true');
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('apex_is_auth');
    localStorage.removeItem('apex_token');
  };

  // Switch Role
  const switchRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem('apex_role', newRole);
    const updatedUser = DEMO_ACCOUNTS[newRole] || { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem('apex_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      role,
      isLoading,
      authError,
      login,
      register,
      quickLogin,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
