const titleElement = document.querySelector(".title-change"); // Target the span element in the title
const resultButtons = document.querySelectorAll(".result-btn"); // Select all media type buttons

// Object for media types
const mediaTypes = {
    Movies: {
        name: 'Movies',
        type: '&type=movie',
        title: 'MOVIES',
    },
    TV: {
        name: 'TV',
        type: '&type=series',
        title: 'TV SERIES',
    },
    Both: {
        name: 'Both',
        type: '&type=',
        title: 'MOVIES + TV',
    }
};

// Function to update the title and fetch media
function handleButtonClick(mediaType) {
    updateTitle(mediaType);
    fetchMedia(mediaType);
}

// Function to update the title
function updateTitle(mediaType) {
    titleElement.textContent = mediaTypes[mediaType].title;
}

// Event listener for each button
resultButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (button.classList.contains("movie-results")) {
            handleButtonClick("Movies");
        } else if (button.classList.contains("tv-results")) {
            handleButtonClick("TV");
        } else if (button.classList.contains("all-results")) {
            handleButtonClick("Both");
        }
    });
});
function fetchMedia(mediaType) {
    let url = '';

    if (mediaType === "Movies") {
        url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1`;
    } else if (mediaType === "TV") {
        url = `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1`;
    } else if (mediaType === "Both") {
        const movieUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1`;
        const tvUrl = `https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1`;

        Promise.all([fetch(movieUrl), fetch(tvUrl)])
            .then(responses => Promise.all(responses.map(res => res.json())))
            .then(([moviesData, tvData]) => {
                showMovies([...moviesData.results, ...tvData.results]); // Merge and display results
            })
            .catch(error => console.error('Error fetching media:', error));
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => showMovies(data.results))
        .catch(error => console.error('Error fetching media:', error));
}
resultButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const mediaType = button.classList.contains("movie-results")
            ? "Movies"
            : button.classList.contains("tv-results")
            ? "TV"
            : "Both";
        
        handleButtonClick(mediaType);
    });
});
