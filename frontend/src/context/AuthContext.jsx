import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Separate states for Owner and Customer
  const [owner, setOwner] = useState(null);
  const [ownerToken, setOwnerToken] = useState(localStorage.getItem('owner_token') || null);
  
  const [customer, setCustomer] = useState(null);
  const [customerToken, setCustomerToken] = useState(localStorage.getItem('customer_token') || null);
  
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const storedOwner = localStorage.getItem('owner_user');
    if (storedOwner && ownerToken) {
      try {
        setOwner(JSON.parse(storedOwner));
      } catch (e) {
        console.error("Error parsing owner user", e);
      }
    }
    
    const storedCustomer = localStorage.getItem('customer_user');
    if (storedCustomer && customerToken) {
      try {
        setCustomer(JSON.parse(storedCustomer));
      } catch (e) {
        console.error("Error parsing customer user", e);
      }
    }
    
    setLoading(false);
  }, [ownerToken, customerToken]);

  const loginOwner = (token, userData) => {
    localStorage.setItem('owner_token', token);
    localStorage.setItem('owner_user', JSON.stringify(userData));
    setOwnerToken(token);
    setOwner(userData);
  };

  const logoutOwner = () => {
    localStorage.removeItem('owner_token');
    localStorage.removeItem('owner_user');
    setOwnerToken(null);
    setOwner(null);
  };

  const loginCustomer = (token, userData) => {
    localStorage.setItem('customer_token', token);
    localStorage.setItem('customer_user', JSON.stringify(userData));
    setCustomerToken(token);
    setCustomer(userData);
  };

  const logoutCustomer = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setCustomerToken(null);
    setCustomer(null);
  };

  // For backward compatibility during migration, but ideally we should update all components
  // We'll keep 'user', 'token', 'login', 'logout' pointing to customer by default if needed,
  // but it's better to be explicit.
  
  return (
    <AuthContext.Provider value={{ 
      owner, ownerToken, loginOwner, logoutOwner,
      customer, customerToken, loginCustomer, logoutCustomer,
      // Provide legacy names for easier transition where appropriate
      user: customer, 
      token: customerToken, 
      login: loginCustomer, 
      logout: logoutCustomer,
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
