import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchNewsAPIArticles, fetchGuardianArticles, fetchNYTimesArticles,fetchWorldNewsArticles  } from "../../config/api";

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (params, { getState }) => {
    const { query, source } =
      getState().articles.filters;

      let articles = [];

      // Fetch from NewsAPI
      if (source.key === 'news-api' || source.key === 'all') {
        const newsAPIArticles = await fetchNewsAPIArticles(query, params);
        articles = [...articles, ...newsAPIArticles];
      }
  
      // Fetch from The Guardian API
      if (source.key === 'guardian-api' || source.key === 'all') {
        const guardianArticles = await fetchGuardianArticles(query, params);
        articles = [...articles, ...guardianArticles];
      }
  
      // Fetch from New York Times API
      if (source.key === 'ny-times' || source.key === 'all') {
        const nyTimesArticles = await fetchNYTimesArticles(query, params);
        articles = [...articles, ...nyTimesArticles];
      }

      // Fetch from World News API
      if (source.key === 'world-news-api' || source.key === 'all') {
        const worldNewsArticles = await fetchWorldNewsArticles(query, params);
        articles = [...articles, ...worldNewsArticles];
      }

      return articles;
  }
);
const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    status: "idle",
    error: null,
    filters: {
      query: "",
      category: "",
      fromDate: "",
      toDate: "",
      source: "",
      author: "",
      preferredSources: [],
      preferredCategories: [],
      preferredAuthors: [],
    },
  },
  reducers: {
    setQuery(state, action) {
      state.filters.query = action.payload;
    },
    setCategory(state, action) {
      state.filters.category = action.payload;
    },
    setDate(state, action) {
      state.filters.date = action.payload;
    },
    setFromDate(state, action) {
      state.filters.fromDate = action.payload;
    },
    setToDate(state, action) {
      state.filters.toDate = action.payload;
    },
    setSource(state, action) {
      state.filters.source = action.payload;
    },
    setAuthor(state, action) {
      state.filters.author = action.payload;
    },
    setPreferredSources(state, action) {
      state.filters.preferredSources = action.payload;
    },
    setPreferredCategories(state, action) {
      state.filters.preferredCategories = action.payload;
    },
    setPreferredAuthors(state, action) {
      state.filters.preferredAuthors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  setQuery,
  setCategory,
  setFromDate,
  setToDate,
  setAuthor,
  setSource,
  setPreferredSources,
  setPreferredCategories,
  setPreferredAuthors,
} = articlesSlice.actions;

export default articlesSlice.reducer;
