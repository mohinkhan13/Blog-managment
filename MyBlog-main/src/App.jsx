import { Route, Routes } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import Dashboard from "./Pages/admin/Dashboard";
import Post from "./Pages/admin/Post";
import Users from "./Pages/admin/Users";
import AddPost from "./Pages/admin/AddPost";
import Category from "./Pages/admin/Category";
import Index from "./Pages/user/Index";
import UserPosts from "./Pages/user/UserPosts";
import SinglePost from "./Pages/user/SinglePost";
import Contact from "./Pages/user/Contact";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import EditUser from "./Pages/admin/EditUser";
import Comments from "./Pages/admin/Comments";
import PostStats from "./Pages/admin/PostStats";
import AdminContact from "./Pages/admin/AdminContact";
import AdminNewsletter from "./Pages/admin/AdminNewsletter";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./redux/dataSlice";
import { useEffect, useContext } from "react";
import Loader from "./components/Loader";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthContext } from "./context/AuthContext";

function App() {
  const dispatch = useDispatch();
  const { loading, error, isDataFetched } = useSelector((state) => state.data);
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isDataFetched && !loading) {
      dispatch(fetchData());
    }
  }, [dispatch, isDataFetched, loading, user]); // user को डिपेंडेंसी में जोड़ा

  if (loading || authLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => dispatch(fetchData())}
            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <PrivateRoute requireAdmin>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="" element={<Dashboard />} />
        <Route path="post" element={<Post />} />
        <Route path="users" element={<Users />} />
        <Route path="users/edit/:id" element={<EditUser />} />
        <Route path="addpost" element={<AddPost />} />
        <Route path="editpost/:id" element={<AddPost />} />
        <Route path="category" element={<Category />} />
        <Route path="comments" element={<Comments />} />
        <Route path="poststats" element={<PostStats />} />
        <Route path="adminContact" element={<AdminContact />} />
        <Route path="adminNewsletter" element={<AdminNewsletter />} />
      </Route>

      <Route path="/" element={<UserLayout />}>
        <Route path="" element={<Index />} />
        <Route path="allpost" element={<UserPosts />} />
        <Route path=":slug" element={<SinglePost />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
