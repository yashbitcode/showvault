import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        movies: 'src/movies.html',
        tvseries: 'src/tvSeries.html',
        people: 'src/people.html',
        bookmarks: 'src/bookmarks.html'
      },
    },
  },
});