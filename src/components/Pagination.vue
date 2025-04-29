<template>
  <div class="flex justify-center mt-12 mb-12">
    <nav class="flex items-center gap-1 sm:gap-2">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="flex items-center px-3 py-2 rounded-lg bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        :class="{'hover:text-white hover:border-gray-600': currentPage !== 1}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="hidden sm:inline">Previous</span>
      </button>
      
      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          class="min-w-[40px] h-10 flex items-center justify-center px-3 rounded-lg transition-all duration-200 font-medium"
          :class="currentPage === page 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:bg-gray-700 hover:text-white'"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="flex items-center px-3 py-2 rounded-lg bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        :class="{'hover:text-white hover:border-gray-600': currentPage !== totalPages}"
      >
        <span class="hidden sm:inline">Next</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  emits: ['page-changed'],
  setup(props, { emit }) {
    const visiblePages = computed(() => {
      const maxVisiblePages = 5;
      const pages = [];
      let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust startPage if endPage is at max
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    const changePage = (page: number) => {
      if (page >= 1 && page <= props.totalPages) {
        emit('page-changed', page);
      }
    };
    
    return {
      visiblePages,
      changePage
    };
  }
});
</script>