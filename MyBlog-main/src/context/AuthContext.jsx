import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import { useDispatch } from "react-redux";
import { fetchData, resetData } from "../redux/dataSlice";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTokens = JSON.parse(localStorage.getItem("tokens"));
    if (savedTokens) {
      authApi
        .getCurrentUser(savedTokens.access)
        .then((userData) => {
          setUser(userData);
          setTokens(savedTokens);
          dispatch(fetchData()); 
        })
        .catch((err) => {
          console.error("Failed to fetch current user:", err);
          setUser(null);
          setTokens(null);
          localStorage.removeItem("tokens");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      dispatch(fetchData()); 
    }
  }, [dispatch]);

  const login = async (email, password) => {
    const data = await authApi.loginUser(email, password);

    // Step 1: Set Tokens in localStorage first
    localStorage.setItem("tokens", JSON.stringify(data.tokens));
    console.log("Stored Tokens:", data.tokens);

    // Step 2: Use setTimeout to ensure data is written
    setTimeout(() => {
      console.log("Stored token after delay:", localStorage.getItem("tokens"));
    }, 1000);

    // Step 3: Set State (Avoid overwriting)
    setUser({ ...data.user, is_superuser: data.user.is_superuser });
    setTokens(data.tokens);

    // Step 4: Fetch data AFTER ensuring token is saved
    setTimeout(() => {
      dispatch(fetchData());
    }, 1000);

    if (data.redirect) {
      navigate(data.redirect);
    }

    return data.redirect;
  };

  const logout = async () => {
    if (tokens) {
      try {
        await authApi.logoutUser(tokens.refresh, tokens.access);
        console.log("Logout successful");
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    setUser(null);
    setTokens(null);
    localStorage.removeItem("tokens");
    dispatch(resetData());
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, loading, tokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
