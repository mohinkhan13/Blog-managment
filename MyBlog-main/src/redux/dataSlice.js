import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const fetchData = createAsyncThunk(
  "data/fetchData",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens")).access
      : null;

    try {
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const [postsRes, categoriesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/posts/`, { headers, cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/categories/`, {
          headers,
          cache: "no-store",
        }),
      ]);

      if (!postsRes.ok)
        throw new Error(`Posts fetch failed: ${postsRes.status}`);
      if (!categoriesRes.ok)
        throw new Error(`Categories fetch failed: ${categoriesRes.status}`);

      const postsData = await postsRes.json();
      const categoriesData = await categoriesRes.json();

      return { posts: postsData, categories: categoriesData };
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    posts: [],
    categories: [],
    loading: false,
    error: null,
    isDataFetched: false,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetData: (state) => {
      state.posts = [];
      state.categories = [];
      state.isDataFetched = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.categories = action.payload.categories;
        state.isDataFetched = true;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetError, resetData } = dataSlice.actions;
export default dataSlice.reducer;
