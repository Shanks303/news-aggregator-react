import axios from 'axios';
import newsImage from '../assests/images/defaultnewsImage.jpg';
// import { categories } from './config';

const NEWS_API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_KEY;
const NYT_API_KEY = import.meta.env.VITE_NYT_KEY;
const WORLDNEWS_API_KEY = import.meta.env.VITE_WORLDNEWS_KEY;

const defaultFromDate = `2024-06-01`;
const defaultToDate = `2024-12-31`;

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
    description: article.description || article.fields?.trailText || article.lead_paragraph || article.text,
    url: article.url || article.webUrl || article.web_url,
    source: article?.source?.name || article?.fields?.publication || article?.source || source,
    publishedAt: article.publishedAt || article.webPublicationDate || article.pub_date|| article.publish_date,
    author: article?.author || article?.fields?.byline || article?.byline?.original || 'Unknown Author',
    category: article?.category || article?.sectionName || 'General',
    imgSrc: article?.fields?.thumbnail || article?.urlToImage || article.image ||(article.multimedia && article.multimedia.length > 0? `https://www.nytimes.com/${article.multimedia[0].url}`: newsImage) || newsImage,
  }));
};


// Fetch NewsAPI articles
export const fetchNewsAPIArticles = async (query, filters) => {

  const baseUrl = `https://newsapi.org/v2`;
  const searchUrl = `${baseUrl}/everything?from=${filters.fromDate}&to=${filters.toDate}`;
  const categoryUrl = `${baseUrl}/top-headlines?country=us&category=${filters.category}`

  const url = (query ) ? searchUrl : categoryUrl;
  const params = {
    apiKey: NEWS_API_KEY,
    q: query,
    pageSize: 10,
  };
  
  const data = await makeApiRequest(url, params);
  return data ? normalizeArticles(data.articles, 'NewsAPI') : [];
};

export const fetchGuardianArticles = async (query, filters) => {
  const url = `https://content.guardianapis.com/search`;

  // Build query parameters dynamically
  const params = {
    q: query || filters?.category || "", 
    'from-date': filters?.fromDate || defaultFromDate, 
    'to-date': filters?.toDate || defaultToDate, 
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'all', 
  };

  const data = await makeApiRequest(url, params);
  return data ? normalizeArticles(data.response.results, 'The Guardian') : [];
};


export const fetchNYTimesArticles = async (query, filters) => {
  const baseUrl = `https://api.nytimes.com/svc/search/v2/articlesearch.json`;

  //nytimes api doesnt contain 'general' category so we use 'science' as default
  const category = filters?.category === 'general' ? 'science' : filters?.category; 

  // Build query parameters dynamically
  const params = {
    'api-key': NYT_API_KEY,
    fq : query || `news_desk:("${category}")` || "",
    begin_date: filters?.fromDate || defaultFromDate, 
    end_date: filters?.toDate || defaultToDate, 
  };

  const data = await makeApiRequest(baseUrl, params);
  return data ? normalizeArticles(data.response.docs, 'The New York Times') : [];
};


export const fetchWorldNewsArticles = async (query, filters) => {
  const baseUrl = `https://api.worldnewsapi.com/search-news`;

  //api works only with fixed dates not more than 30 days
  const fixedFromDate = `2024-12-15`;
  const fixedToDate = `2024-12-31`;

    //world times api doesnt contain 'general' category so we use 'science' as default
    const category = filters?.category === 'general' ? 'science' : filters?.category; 

  // Build query parameters dynamically
  const params = {
    'api-key': WORLDNEWS_API_KEY,
    text: query || "", 
    categories: category,
    language: 'en',
    'earliest-publish-date': filters?.fromDate || fixedFromDate,
    'latest-publish-date': filters?.toDate || fixedToDate, 
    'source-country': 'us',
  };

  const data = await makeApiRequest(baseUrl, params);
  return data ? normalizeArticles(data.news, 'World News') : [];
};
