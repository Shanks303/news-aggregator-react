import axios from 'axios';
import newsImage from '../assests/images/defaultnewsImage.jpg';

const NEWS_API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_KEY;
const BBC_API_KEY = import.meta.env.VITE_NYT_KEY;

// Helper function to make API requests
const makeApiRequest = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
};

// Helper function to normalize article data
const normalizeArticles = (articles, source) => {
  return articles.map((article) => ({
    title: article.title || article.webTitle || article.headline?.main,
    description: article.description || article.fields?.trailText || article.lead_paragraph,
    url: article.url || article.webUrl || article.web_url,
    source: article?.source?.name || article?.fields?.publication || article?.source,
    publishedAt: article.publishedAt || article.webPublicationDate || article.pub_date,
    author: article?.author || article?.fields?.byline || article?.byline?.original || 'Unknown Author',
    category: article?.category || article?.sectionName || 'General',
    imgSrc: article?.fields?.thumbnail || article?.urlToImage || article.image ||(article.multimedia && article.multimedia.length > 0
    ? `https://www.nytimes.com/${article.multimedia[0].url}`: newsImage) || newsImage,
  }));
};

// Fetch NewsAPI articles
export const fetchNewsAPIArticles = async (query, filters) => {
  const searchUrl = `https://newsapi.org/v2/everything?q=${query}&from=${filters.fromDate}&to=${filters.toDate}`;
  const topHeadUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${filters.category}`;
  const categoryUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${filters.category}`

  const url = (query ) ? searchUrl : (filters.category) ? categoryUrl : topHeadUrl;
  const params = {
    apiKey: NEWS_API_KEY,
  };
  
  const data = await makeApiRequest(url, params);
  return data ? normalizeArticles(data.articles, 'NewsAPI') : [];
};

// Fetch The Guardian articles
export const fetchGuardianArticles = async (query, filters) => {
  const searchUrl = `https://content.guardianapis.com/search`;
  const searchWithDateUrl = `https://content.guardianapis.com?from-date=${filters.fromDate}&to-date=${filters.toDate}`;
  const url = (query || filters.category) ? searchUrl : (filters.fromDate) ? searchWithDateUrl : searchUrl;

  const params = {
    q: query || filters.category,
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'all',
  };

  const data = await makeApiRequest(url, params);
  return data ? normalizeArticles(data.response.results, 'The Guardian') : [];
};

// Fetch NewYork News articles
export const fetchNYTimesArticles = async (query, filters) => {
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json`;
  const params = {
    fq: query,
    'api-key': BBC_API_KEY,
    category: filters.category,
    begin_date: filters.fromDate,
    end_date: filters.toDate,
  };

  const data = await makeApiRequest(url, params);
  return data ? normalizeArticles(data.response.docs, 'The New York Times') : [];
};
