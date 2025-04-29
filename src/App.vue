<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white font-sans">
    <div class="">
    <header class="bg-gray-900/80 backdrop-blur-lg shadow-lg py-6 sticky top-0 z-10 border-b border-gray-800/50">
      <div class="container screen mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            CineFinder</h1>
          <p class="text-gray-400">Discover your next favorite movie</p>
        </div>
        <div class="flex items-center space-x-2">
          <button class="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button class="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="container mx-auto screen px-4 sm:px-6 py-8">
      <SearchBar @search="handleSearch" />

      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <div class="w-16 h-16 relative">
          <div class="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div
            class="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-3 left-3">
          </div>
        </div>
        <p class="text-gray-400 mt-4">Loading movies...</p>
      </div>

      <div v-else-if="error"
        class="bg-red-500/20 backdrop-blur-sm border border-red-500/50 text-white p-6 rounded-xl shadow-lg my-8">
        <div class="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>
      </div>

      <div v-else class="pt-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <template v-if="movies.length > 0">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
          </template>
          <template v-else>
            <div class="col-span-full text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              <p class="text-xl text-gray-400 mb-2">No movies found</p>
              <p class="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          </template>
        </div>

        <Pagination v-if="movies.length > 0" :current-page="currentPage" :total-pages="totalPages"
          @page-changed="handlePageChange" class="pt-10" />
      </div>
    </main>

  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import MovieCard from './components/MovieCard.vue';
import SearchBar from './components/SearchBar.vue';
import Pagination from './components/Pagination.vue';
import api from './services/api';
import type { Movie } from './types/movies';

export default defineComponent({
  components: {
    MovieCard,
    SearchBar,
    Pagination
  },
  setup() {
    const movies = ref<Movie[]>([]);
    const loading = ref(true);
    const error = ref('');
    const currentPage = ref(1);
    const totalPages = ref(0);
    const searchQuery = ref('');
    const selectedGenreId = ref(0);

    const loadMovies = async () => {
      loading.value = true;
      error.value = '';

      try {
        const response = await api.getMovies(
          currentPage.value,
          searchQuery.value,
          selectedGenreId.value
        );

        movies.value = response.results;
        totalPages.value = Math.min(response.total_pages, 500); // TMDB API limit
      } catch (err) {
        error.value = 'Failed to load movies. Please try again later.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = (searchParams: { query: string; genreId: number }) => {
      searchQuery.value = searchParams.query;
      selectedGenreId.value = searchParams.genreId;
      currentPage.value = 1; // Reset to first page
      loadMovies();
    };

    const handlePageChange = (page: number) => {
      currentPage.value = page;
      loadMovies();

      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    onMounted(loadMovies);

    return {
      movies,
      loading,
      error,
      currentPage,
      totalPages,
      handleSearch,
      handlePageChange
    };
  }
});
</script>
