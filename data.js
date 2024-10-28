async function fetchData() {
  const apiKey = "79a74590457937928e9fe7824aa3fb3d";
  const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    fetch('/grafik/conn.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data.results)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Output pesan dari server
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return data.results.slice(0, 20); // Ambil 20 film dengan penonton terbanyak
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function updateBarChart() {
  const movies = await fetchData();

  // Urutkan film berdasarkan popularitas secara menurun
  const sortedMovies = movies.sort((a, b) => b.popularity - a.popularity);

  const movieTitles = sortedMovies.map((movie) => movie.title);
  const moviePopularity = sortedMovies.map((movie) => movie.popularity);

  const barData = {
    labels: movieTitles,
    datasets: [
      {
        label: "Popularity",
        data: moviePopularity,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barCtx = document.getElementById("barChart").getContext("2d");
  const barChart = new Chart(barCtx, {
    type: "bar",
    data: barData,
    options: barOptions,
  });
}

// Call the function to update the bar chart
updateBarChart();

// Function to process data and update pie charts
async function updatePieCharts() {
  const movies = await fetchData();

  // Menghitung jumlah film untuk setiap genre
  const genreCount = {};
  movies.forEach((movie) => {
    movie.genre_ids.forEach((genreId) => {
      if (genreCount[genreId]) {
        genreCount[genreId]++;
      } else {
        genreCount[genreId] = 1;
      }
    });
  });

  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  // Mengubah genre ID menjadi nama genre
  const genreNames = {};
  Object.keys(genreCount).forEach((genreId) => {
    genreNames[genreId] = genreMap[genreId];
  });

  // Mengurutkan genre berdasarkan jumlah film
  const sortedGenresByCount = Object.keys(genreCount).sort(
    (a, b) => genreCount[b] - genreCount[a]
  );
  const top5GenresByCount = sortedGenresByCount.slice(0, 5);
  const top5GenreNamesByCount = top5GenresByCount.map(
    (genreId) => genreNames[genreId]
  );
  const top5GenreCountsByCount = top5GenresByCount.map(
    (genreId) => genreCount[genreId]
  );

  // Data untuk pie chart 1 (lima genre dengan total film terbanyak)
  const pieData1 = {
    labels: top5GenreNamesByCount,
    datasets: [
      {
        label: "Total Films",
        data: top5GenreCountsByCount,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Menghitung total penonton untuk setiap genre
  const genrePopularity = {};
  movies.forEach((movie) => {
    movie.genre_ids.forEach((genreId) => {
      if (genrePopularity[genreId]) {
        genrePopularity[genreId] += movie.popularity;
      } else {
        genrePopularity[genreId] = movie.popularity;
      }
    });
  });

  // Mengurutkan genre berdasarkan total penonton
  const sortedGenresByPopularity = Object.keys(genrePopularity).sort(
    (a, b) => genrePopularity[b] - genrePopularity[a]
  );
  const top5GenresByPopularity = sortedGenresByPopularity.slice(0, 5);
  const top5GenreNamesByPopularity = top5GenresByPopularity.map(
    (genreId) => genreNames[genreId]
  );
  const top5GenrePopularityByPopularity = top5GenresByPopularity.map(
    (genreId) => genrePopularity[genreId]
  );

  // Data untuk pie chart 2 (lima genre dengan total penonton terbanyak)
  const pieData2 = {
    labels: top5GenreNamesByPopularity,
    datasets: [
      {
        label: "Total Popularity",
        data: top5GenrePopularityByPopularity,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 205, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mendapatkan konteks dari canvas untuk masing-masing pie chart
  const pieCtx1 = document.getElementById("pieChart1").getContext("2d");
  const pieCtx2 = document.getElementById("pieChart2").getContext("2d");

  // Menggambar pie charts
  new Chart(pieCtx1, {
    type: "pie",
    data: pieData1,
  });

  new Chart(pieCtx2, {
    type: "pie",
    data: pieData2,
  });
}

// Memanggil fungsi untuk mengupdate pie charts
updatePieCharts();
