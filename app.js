// Clé API pour accéder à l'OMDb API (Remplacez par votre propre clé)
const apiKey = '7cc72720';

// Sélection des éléments du DOM
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');

// Ajout d'un gestionnaire d'événement au formulaire de recherche
searchForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Récupération du terme de recherche
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
        try {
            // Appel de la fonction fetchMovies pour obtenir les résultats
            const response = await fetchMovies(searchTerm);
            const data = await response.json();

            if (data.Search) {
                // Affichage des résultats s'il y en a
                displayMovies(data.Search);
            } else {
                // Affichage d'un message s'il n'y a pas de résultats
                resultsContainer.innerHTML = '<p class="text-red-500">Aucun résultat trouvé</p>';
            }
        } catch (error) {
            console.error('Erreur lors de la recherche :', error);
        }
    }
});

// Fonction asynchrone pour récupérer les films depuis l'OMDb API
async function fetchMovies(query) {
    const url = `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`;
    return await fetch(url);
}

// Fonction asynchrone pour obtenir les détails d'un film par son IMDb ID
async function getMovieDetails(imdbID) {
    const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`;

    try {
        const response = await fetch(url);
        const responseText = await response.text();

        try {
            // Analyse de la réponse JSON
            const data = JSON.parse(responseText);

            if (data.Response === 'True') {
                // Retourne un objet avec les détails du film
                return {
                    title: data.Title,
                    year: data.Year,
                    poster: data.Poster,
                    summary: data.Plot,
                    // Ajouter d'autres propriétés si nécessaire
                };
            } else {
                // En cas d'erreur, affiche la réponse JSON complète dans la console
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

// Fonction pour afficher les films dans le conteneur de résultats
function displayMovies(movies) {
    resultsContainer.innerHTML = '';

    // Parcours des films et création des cartes
    movies.forEach((movie, index) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('bg-white', 'p-4', 'rounded', 'shadow-md', 'flex', 'flex-col', 'items-center', 'transition-transform', 'transform', 'hover:scale-105');

        // Ajout d'un attribut de données IMDb ID à la carte
        movieCard.dataset.imdbId = movie.imdbID;
        movieCard.setAttribute('data-aos', 'fade-up');
        movieCard.setAttribute('data-aos-delay', `${index * 100}`);

        // Remplissage du contenu de la carte avec les informations du film
        movieCard.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}" class="mx-auto mb-4">
            <h2 class="text-xl font-bold text-center">${movie.Title}</h2>
            <p class="text-gray-600 text-center">Date de sortie: ${movie.Year}</p>
            <button class="mt-2 bg-blue-500 text-white p-2 rounded read-more-button hover:bg-blue-600">Read More</button>
        `;

        // Ajout de la carte au conteneur de résultats
        resultsContainer.appendChild(movieCard);

        // Ajout d'un gestionnaire d'événement pour afficher plus de détails lors du clic
        movieCard.addEventListener('click', () => handleReadMore(movie.imdbID));
    });

    // Met à jour AOS après avoir ajouté de nouveaux éléments
    AOS.refresh();
}

// Fonction pour gérer le clic sur le bouton "Read More"
async function handleReadMore(imdbID) {
    try {
        // Appel de la fonction getMovieDetails pour obtenir les détails du film
        const movie = await getMovieDetails(imdbID);
        // Affichage d'une popup avec les détails du film
        openPopup(movie);
    } catch (error) {
        console.error('Erreur lors de l\'affichage des détails du film :', error);
    }
}

// Fonction pour ouvrir une popup avec les détails du film
function openPopup(movie) {
    const modal = document.createElement('div');
    modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center');

    // Remplissage du contenu de la popup avec les détails du film
    modal.innerHTML = `
        <div class="bg-white p-8 rounded shadow-lg">
            <h2 class="text-2xl font-bold mb-4">${movie.title}</h2>
            <p class="text-gray-600 mb-4">Date de sortie: ${movie.year}</p>
            <img src="${movie.poster}" alt="${movie.title}" class="mb-4">
            <p class="text-gray-800">${movie.summary}</p>
            <button class="bg-blue-500 text-white p-2 rounded" id="closePopup">Fermer</button>
        </div>
    `;

    // Ajout de la popup au corps du document
    document.body.appendChild(modal);

    // Ajout d'un événement pour fermer la popup lors du clic sur le bouton "Fermer"
    const closePopupButton = modal.querySelector('#closePopup');
    closePopupButton.addEventListener('click', () => document.body.removeChild(modal));
}

// Initialisation de la bibliothèque AOS pour les animations au défilement
AOS.init();
