<template>
  <div class="bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl mb-8 border border-gray-700/50 shadow-xl">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-grow relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchInput"
          type="text"
          placeholder="Search for movies..."
          class="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-700/50 text-white border border-gray-600/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none transition-all duration-300"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="w-full md:w-56 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <select
          v-model="selectedGenre"
          class="w-full py-3 pl-10 pr-4 rounded-xl bg-gray-700/50 text-white border border-gray-600/50 focus:border-blue-500 focus:ring focus:ring-blue-500/20 focus:outline-none appearance-none transition-all duration-300"
          @change="handleGenreChange"
        >
          <option :value="0">All Genres</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <button
        @click="handleSearch"
        class="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-medium flex items-center justify-center"
      >
        <span>Search</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import api from '../services/api';
import type { Genre } from '../types/movie';

export default defineComponent({
  emits: ['search'],
  setup(_, { emit }) {
    const searchInput = ref('');
    const selectedGenre = ref(0);
    const genres = ref<Genre[]>([]);
    
    const loadGenres = async () => {
      try {
        const response = await api.getGenres();
        genres.value = response.genres;
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };
    
    const handleSearch = () => {
      emit('search', {
        query: searchInput.value,
        genreId: selectedGenre.value
      });
    };
    
    const handleGenreChange = () => {
      handleSearch();
    };
    
    onMounted(loadGenres);
    
    return {
      searchInput,
      selectedGenre,
      genres,
      handleSearch,
      handleGenreChange
    };
  }
});
</script>