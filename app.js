// Au début de votre fichier JavaScript
require('dotenv').config();

const apiKey = process.env.API_KEY;

console.log('Clé API :', apiKey); // Ajout de cette ligne pour déboguer

// Le reste de votre code reste inchangé


// Le reste de votre code reste inchangé


const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
        try {
            const response = await fetchMovies(searchTerm);
            const data = await response.json();

            if (data.Search) {
                displayMovies(data.Search);
            } else {
                resultsContainer.innerHTML = '<p class="text-red-500">Aucun résultat trouvé</p>';
            }
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
        }
    }
});

async function fetchMovies(query) {
    const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
    return await fetch(url);
}

async function getMovieDetails(imdbID) {
    console.log('ID IMDb :', imdbID); // Ajout de cette ligne pour afficher l'ID IMDb
    const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const responseText = await response.text();

        console.log('Réponse brute JSON :', responseText); // Affiche la réponse brute dans la console

        try {
            const data = JSON.parse(responseText);

            if (data.Response === 'True') {
                return {
                    title: data.Title,
                    year: data.Year,
                    poster: data.Poster,
                    summary: data.Plot,
                    // Ajoute d'autres propriétés nécessaires
                };
            } else {
                console.error('Réponse JSON complète en cas d\'erreur :', responseText);
                throw new Error(data.Error || 'Erreur inconnue lors de la récupération des détails du film');
            }
        } catch (parseError) {
            console.error('Erreur de parsing JSON :', parseError);
            throw parseError;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film :', error);
        throw error;
    }
}

function displayMovies(movies) {
    resultsContainer.innerHTML = '';

    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('bg-white', 'p-4', 'rounded', 'shadow-md', 'flex', 'flex-col', 'items-center', 'transition-transform', 'transform', 'hover:scale-105');

        console.log(movie.imdbID);

        movieCard.dataset.imdbId = movie.imdbID;
        movieCard.setAttribute('data-aos', 'fade-up');
        movieCard.setAttribute('data-aos-delay', `${index * 100}`);

        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" class="mx-auto mb-4">
            <h2 class="text-xl font-bold text-center">${movie.Title}</h2>
            <p class="text-gray-600 text-center">Date de sortie: ${movie.Year}</p>
            <button class="mt-2 bg-blue-500 text-white p-2 rounded read-more-button hover:bg-blue-600">Read More</button>
        `;

        resultsContainer.appendChild(movieCard);

        movieCard.addEventListener('click', () => handleReadMore(movie.imdbID));
    });

    // Met à jour AOS après avoir ajouté de nouveaux éléments
    AOS.refresh();
}

async function handleReadMore(imdbID) {
    try {
        const movie = await getMovieDetails(imdbID);
        openPopup(movie);
    } catch (error) {
        console.error('Erreur lors de l\'affichage des détails du film :', error);
    }
}

function openPopup(movie) {
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center');

    modal.innerHTML = `
        <div class="bg-white p-8 rounded shadow-lg">
            <h2 class="text-2xl font-bold mb-4">${movie.title}</h2>
            <p class="text-gray-600 mb-4">Date de sortie: ${movie.year}</p>
            <img src="${movie.poster}" alt="${movie.title}" class="mb-4">
            <p class="text-gray-800">${movie.summary}</p>
            <button class="bg-blue-500 text-white p-2 rounded" id="closePopup">Fermer</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Ajoutons un événement pour fermer la popup
    const closePopupButton = modal.querySelector('#closePopup');
    closePopupButton.addEventListener('click', () => document.body.removeChild(modal));
}

AOS.init();
