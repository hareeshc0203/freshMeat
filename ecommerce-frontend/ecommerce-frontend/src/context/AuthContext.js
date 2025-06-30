import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userFirstName, setUserFirstName] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("firstname");
    if (storedName) setUserFirstName(storedName);
  }, []);

  const login = (name) => {
    localStorage.setItem("firstname", name);
    setUserFirstName(name);
  };

  const logout = () => {
    localStorage.removeItem("firstname");
    setUserFirstName(null);
  };

  return (
    <AuthContext.Provider value={{ userFirstName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
