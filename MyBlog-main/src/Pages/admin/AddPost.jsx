import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux"; // Add useDispatch
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AuthContext } from "../../context/AuthContext";
import { fetchData } from "../../redux/dataSlice"; // Import fetchData

const quillStyles = `
  .ql-container, .ql-editor { 
    border: none !important; 
    box-shadow: none !important; 
    height: auto; 
  }
  .ql-editor { 
    font-size: 20px; 
    line-height: 1.5; 
    min-height: 400px; 
    padding: 1rem;
  }
  .ql-toolbar { 
    border: 2px solid #ccc !important; 
    margin-top: 30px; 
    border-radius: 0.5rem;
  }
`;

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function AddPost() {
  const { user, tokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch
  const { id } = useParams();
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const [post, setPost] = useState({
    title: "",
    content: "",
    status: "draft",
    category: null,
    tags: "",
    featuredImage: null,
    existingImage: null,
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/`, {
          headers: {
            Authorization: `Bearer ${tokens?.access}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Failed to load categories");
        console.error(err);
      }
    };
    fetchCategories();
  }, [tokens]);

  // Fetch post data if editing
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(`${API_BASE_URL}/posts/${id}/`, {
            headers: {
              Authorization: `Bearer ${tokens?.access}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch post");
          const data = await res.json();
          setPost({
            title: data.title,
            content: data.content,
            status: data.status,
            category: data.category,
            tags: data.tags || "",
            featuredImage: null,
            existingImage: data.image,
          });
          setImagePreview(data.image);
          if (quillInstance.current) {
            quillInstance.current.root.innerHTML = data.content;
          }
        } catch (err) {
          setError("Failed to load post");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, tokens]);

  // Initialize Quill
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = quillStyles;
    document.head.appendChild(styleTag);

    if (!quillInstance.current && editorRef.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            [{ header: [1, 2, 3, false] }],
          ],
        },
        placeholder: "Write your content here...",
      });

      quillInstance.current.on("text-change", () => {
        setPost((prev) => ({
          ...prev,
          content: quillInstance.current.root.innerHTML,
        }));
      });
    }

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    setPost((prev) => ({ ...prev, category: Number(e.target.value) }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, or GIF)");
      return;
    }

    if (file.size > maxSize) {
      setError("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let { width, height } = img;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const optimizedFile = new File([blob], "optimized-image.webp", {
              type: "image/webp",
              lastModified: Date.now(),
            });

            setPost((prev) => ({
              ...prev,
              featuredImage: optimizedFile,
              existingImage: null,
            }));

            setImagePreview(URL.createObjectURL(optimizedFile));
          },
          "image/webp",
          0.8
        );
      };
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!post.title.trim()) {
      setError("Title cannot be empty");
      return;
    }
    if (!post.category) {
      setError("Please select a category");
      return;
    }

    if (!tokens || !tokens.access) {
      setError("Authentication token missing. Please log in again.");
      console.log("Tokens missing:", tokens);
      return;
    }

    console.log("Submitting with token:", tokens.access);

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("status", post.status);
    formData.append("category", post.category);
    formData.append("tags", post.tags);
    if (post.featuredImage) {
      formData.append("image", post.featuredImage);
    }

    try {
      const url = id
        ? `${API_BASE_URL}/posts/${id}/`
        : `${API_BASE_URL}/posts/`;
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${tokens.access}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to save post");
      }

      // Fetch updated data after successful save
      await dispatch(fetchData({ isAdmin: user.is_superuser })).unwrap(); // Dispatch fetchData
      navigate("/admin/post");
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen gap-6 p-6 bg-gray-100">
      <div className="w-2/3 p-6 bg-white rounded-lg shadow-lg">
        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        {isLoading && <p className="text-center">Loading...</p>}
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="w-full p-3 text-xl font-bold border-b-2 border-gray-300 outline-none focus:border-blue-500"
          placeholder="Enter Post Title"
          disabled={isLoading}
        />
        <div ref={editorRef} className="mt-4" />
      </div>

      <div className="w-1/3 space-y-6">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <label className="block mb-2 font-medium">Status</label>
          <select
            name="status"
            value={post.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <label className="block mb-5 font-medium">Categories</label>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={post.category === cat.id}
                  onChange={handleCategoryChange}
                  className="w-4 h-4"
                  disabled={isLoading}
                />
                <label>{cat.name}</label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Loading categories...</p>
          )}
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <label className="block mb-2 font-medium">Tags</label>
          <input
            type="text"
            name="tags"
            value={post.tags}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="comma, separated, tags"
            disabled={isLoading}
          />
        </div>

        <div className="p-4 bg-white rounded-lg shadow-lg">
          <label className="block mb-2 font-medium">Featured Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/jpeg,image/png,image/gif"
            className="w-full"
            disabled={isLoading}
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="object-cover w-full rounded-lg max-h-40"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full p-3 text-white rounded-lg transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? "Saving..." : id ? "Update Post" : "Publish Post"}
        </button>
      </div>
    </div>
  );
}
