import React, { useState, useEffect, useRef } from "react";

export default function Category() {
  const [category, setCategory] = useState({ name: "", image: null });
  const [allCategory, setAllCategory] = useState([]);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For previewing the optimized image
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setIsLoading(true);
    setError(null);
    fetch("http://127.0.0.1:8000/api/categories/")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      })
      .then((data) => setAllCategory(data))
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleChanges = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files[0]) {
      optimizeImage(files[0]);
    } else {
      setCategory((prev) => ({ ...prev, [name]: value }));
    }
  };

  const optimizeImage = (file) => {
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

        const MAX_WIDTH = 800; // Resize width (Adjustable)
        const MAX_HEIGHT = 800; // Resize height (Adjustable)
        let { width, height } = img;

        // Maintain aspect ratio
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

        // Convert to WebP (if supported) or fallback to JPEG
        canvas.toBlob(
          (blob) => {
            const optimizedFile = new File([blob], "optimized-image.webp", {
              type: "image/webp",
              lastModified: Date.now(),
            });

            setCategory((prev) => ({
              ...prev,
              image: optimizedFile,
            }));

            setImagePreview(URL.createObjectURL(optimizedFile));
          },
          "image/webp",
          0.8 // 80% quality
        );
      };
    };
  };

  const submitData = (e) => {
    e.preventDefault();
    if (!category.name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("slug", category.name.toLowerCase().replace(/\s+/g, "-"));
    if (category.image) {
      formData.append("image", category.image);
    }

    fetch(
      id
        ? `http://127.0.0.1:8000/api/categories/${id}/`
        : "http://127.0.0.1:8000/api/categories/",
      {
        method: id ? "PUT" : "POST",
        body: formData,
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to submit category");
        return response.json();
      })
      .then((data) => {
        if (id) {
          setAllCategory(
            allCategory.map((item) => (item.id === id ? data : item))
          );
        } else {
          setAllCategory([...allCategory, data]);
        }
        resetForm();
      })
      .catch((error) => {
        console.error("Error submitting category:", error);
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsLoading(true);
      setError(null);
      fetch(`http://127.0.0.1:8000/api/categories/${categoryId}/`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete category");
          setAllCategory(allCategory.filter((cat) => cat.id !== categoryId));
        })
        .catch((error) => {
          console.error("Error deleting category:", error);
          setError(error.message);
        })
        .finally(() => setIsLoading(false));
    }
  };

  const resetForm = () => {
    setCategory({ name: "", image: null });
    setId(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-10">
      <form
        onSubmit={submitData}
        className="flex flex-col gap-5 p-5 bg-white rounded w-96"
      >
        <input
          className="px-2 py-2 border-b outline-0"
          type="text"
          name="name"
          placeholder="Category"
          onChange={handleChanges}
          value={category.name}
          disabled={isLoading}
          aria-label="Category name"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChanges}
          ref={fileInputRef}
          className="py-2 text-white bg-gray-500"
          disabled={isLoading}
          aria-label="Category image"
        />
        {imagePreview && (
          <div>
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover w-32 h-32"
            />
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 py-2 text-white bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : id !== null ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="flex-1 py-2 text-white bg-gray-600 disabled:opacity-50"
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
      {isLoading && <p>Loading...</p>}
      {!isLoading && allCategory.length > 0 && (
        <table className="border border-collapse border-gray-300">
          <thead>
            <tr>
              <th className="px-5 py-2 text-center border">Sr no.</th>
              <th className="px-5 py-2 border">Category</th>
              <th className="px-5 py-2 border">Image</th>
              <th className="px-5 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {allCategory.map((item, index) => (
              <tr key={item.id}>
                <td className="px-5 py-2 text-center border">{index + 1}</td>
                <td className="px-5 py-2 border">{item.name}</td>
                <td className="px-5 py-2 border">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-16 h-16"
                    />
                  )}
                </td>
                <td className="px-5 py-2 border">
                  <button
                    className="px-2 py-1 text-white bg-green-500 disabled:opacity-50"
                    onClick={() => {
                      setCategory({ name: item.name, image: null });
                      setId(item.id);
                    }}
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 ml-2 text-white bg-red-500 disabled:opacity-50"
                    onClick={() => handleDelete(item.id)}
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && allCategory.length === 0 && <p>No categories found</p>}
    </div>
  );
}
