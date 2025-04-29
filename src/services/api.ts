import { ref } from 'vue';

const API_KEY = '8df40cda2d99bfa806029ed17015383c'; 
const BASE_URL = 'https://api.themoviedb.org/3';

export const isLoading = ref(false);

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (!navigator.onLine) {
    throw new Error('Network connection lost. Please check your internet connection and try again.');
  }
  
  if (error.response) {
    const status = error.response.status;
    
    if (status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else if (status === 404) {
      throw new Error('The requested resource was not found.');
    } else if (status >= 500) {
      throw new Error('The movie database service is currently unavailable. Please try again later.');
    }
  }
  
  throw new Error('An unexpected error occurred. Please try again later.');
};

const timeoutPromise = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout. Please try again.')), ms);
  });
};

export default {
  async getMovies(page = 1, searchQuery = '', genreId = 0) {
    isLoading.value = true;
    
    try {
      let endpoint = '/discover/movie';
      let params = `api_key=${API_KEY}&page=${page}&sort_by=popularity.desc&include_adult=false`;
      
      if (searchQuery) {
        endpoint = '/search/movie';
        params += `&query=${encodeURIComponent(searchQuery)}`;
      }
      
      if (genreId > 0) {
        params += `&with_genres=${genreId}`;
      }
      
      const url = `${BASE_URL}${endpoint}?${params}`;
      
      const response = await Promise.race([
        fetch(url),
        timeoutPromise(10000) 
      ]) as Response;
      
      if (!response.ok) {
        throw { response };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  },
  
  async getGenres() {
    try {
      const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`;
      
      const response = await Promise.race([
        fetch(url),
        timeoutPromise(5000) 
      ]) as Response;
      
      if (!response.ok) {
        throw { response };
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  async getMovieDetails(movieId: number) {
    isLoading.value = true;
    
    try {
      const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar`;
      
      const response = await Promise.race([
        fetch(url),
        timeoutPromise(8000) 
      ]) as Response;
      
      if (!response.ok) {
        throw { response };
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  },
  
  getImageUrl(path: string | null, size = 'w500'): string {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
  
  getBackdropUrl(path: string | null, size = 'original'): string {
    if (!path) return 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};
