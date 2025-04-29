<template>
  <div class="bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 border border-gray-700/50 group">
    <div class="relative overflow-hidden">
      <img 
        :src="posterUrl" 
        :alt="movie.title"
        class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute top-2 right-2">
        <span class="backdrop-blur-md bg-black/30 text-white font-medium rounded-full px-3 py-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {{ movie.vote_average.toFixed(1) }}
        </span>
      </div>
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p class="text-gray-200 text-sm line-clamp-3">{{ movie.overview || 'No overview available' }}</p>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">{{ movie.title }}</h3>
      <p class="text-gray-400 text-sm">{{ formattedDate }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import api from '../services/api';
import type { Movie } from '../types/movies';

export default defineComponent({
  props: {
    movie: {
      type: Object as () => Movie,
      required: true
    }
  },
  setup(props) {
    const posterUrl = computed(() => api.getImageUrl(props.movie.poster_path));
    
    const formattedDate = computed(() => {
      if (!props.movie.release_date) return 'Unknown date';
      return new Date(props.movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });
    
    return {
      posterUrl,
      formattedDate
    };
  }
});
</script>
