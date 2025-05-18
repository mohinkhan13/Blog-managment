import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader"; // Assuming Loader component exists

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && !user.is_superuser) return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
