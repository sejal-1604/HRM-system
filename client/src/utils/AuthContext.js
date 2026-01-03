import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Check if it's first time login (password not changed)
      if (parsedUser.passwordChanged === false) {
        setIsFirstTimeLogin(true);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    // For new users from signup, passwordChanged should be false
    // For existing users, check if they have passwordChanged property
    const userWithPasswordFlag = {
      ...userData,
      passwordChanged: userData.passwordChanged !== undefined ? userData.passwordChanged : true
    };
    setUser(userWithPasswordFlag);
    localStorage.setItem('user', JSON.stringify(userWithPasswordFlag));
    localStorage.setItem('token', token);
    
    // Check if it's first time login (only for newly created users)
    if (userWithPasswordFlag.passwordChanged === false) {
      setIsFirstTimeLogin(true);
    } else {
      setIsFirstTimeLogin(false);
    }
  };

  const updatePassword = (newPassword) => {
    const updatedUser = {
      ...user,
      password: newPassword,
      passwordChanged: true
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsFirstTimeLogin(false);
  };

  const signup = async (name, email, password, role = 'employee') => {
    try {
      // Mock signup - replace with real API call
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: Date.now(),
          name,
          email,
          role,
          passwordChanged: false // New users need to change password
        },
      };
      
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      setUser(mockResponse.user);
      setIsFirstTimeLogin(true); // New users must change password
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsFirstTimeLogin(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updatePassword, isFirstTimeLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};