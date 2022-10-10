const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export default {
  API_KEY,
  BASE_URL,
  fetchUpcomingMovies: {
    listContext: "comingSoon",
    title: "Coming Soon",
    url: `/movie/upcoming?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchUpcomingTV: {
    listContext: "comingSoon",
    title: "Coming Soon",
    url: `/tv/upcoming?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchTrendingMovies: {
    listContext: "trending",
    title: "Trending",
    url: `/trending/movie/day?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchPopularMovies: {
    listContext: "popularMovies",
    title: "Popular on Netflix",
    url: `/movie/popular?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchNowPlayingMovies: {
    listContext: "nowPlayingMovies",
    title: "Now Playing",
    url: `/movie/now_playing?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchTopRatedMovies: {
    listContext: "topRatedMovies",
    title: "Top rated in the U.S. Today",
    url: `/movie/top_rated?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchLatestMovies: {
    listContext: "newMovies",
    title: "New on Netflix",
    url: `/movie/latest?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchActionMovies: {
    listContext: "actionMovies",
    title: "Action Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=28&append_to_response=videos,images`,
  },
  fetchComedyMovies: {
    listContext: "comedyMovies",
    title: "Comedy Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=35&append_to_response=videos,images`,
  },
  fetchHorrorMovies: {
    listContext: "horrorMovies",
    title: "Horror Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=27&append_to_response=videos,images`,
  },
  fetchRomanceMovies: {
    listContext: "romanceMovies",
    title: "Romance Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=10749&append_to_response=videos,images`,
  },
  fetchMysteryMovies: {
    listContext: "mysteryMovies",
    title: "Mystery Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=9648&append_to_response=videos,images`,
  },
  fetchSciFiMovies: {
    listContext: "sciFiMovies",
    title: "SciFi Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=878&append_to_response=videos,images`,
  },
  fetchWesternMovies: {
    listContext: "westernMovies",
    title: "Western Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=37&append_to_response=videos,images`,
  },
  fetchAnimatedMovies: {
    listContext: "animatedMovies",
    title: "Animated Movies",
    url: `/discover/movie/?api_key=${API_KEY}&region=US&with_genres=16&append_to_response=videos,images`,
  },
  fetchLatestTV: {
    listContext: "latestTV",
    title: "Latest TV",
    url: `/tv/latest/?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchTrendingTV: {
    listContext: "trendingTV",
    title: "Trending Shows",
    url: `/trending/tv/day?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchAiringTodayTV: {
    listContext: "currentlyAiringTV",
    title: "Shows Currently Airing",
    url: `/tv/airing_today/?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchTopRatedTV: {
    listContext: "topRatedTV",
    title: "Top Rated Shows in the U.S.",
    url: `/tv/top_rated/?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
  fetchPopularTV: {
    listContext: "popularTV",
    title: "Popular Shows on Netflix",
    url: `/tv/popular/?api_key=${API_KEY}&append_to_response=videos,images&region=US`,
  },
};
