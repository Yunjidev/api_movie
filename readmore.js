// Ajout d'un gestionnaire d'événement au conteneur de résultats pour écouter les clics
resultsContainer.addEventListener('click', function (e) {
  // Recherche du bouton "Read More" le plus proche dans la hiérarchie DOM
  const readMoreButton = e.target.closest('.read-more-button');
  
  if (readMoreButton) {
    // Recherche de la carte de film la plus proche dans la hiérarchie DOM
    const movieCard = readMoreButton.closest('.bg-white');
    const imdbID = movieCard.dataset.imdbId;

    // Vérifie si l'ID IMDb est défini
    if (imdbID) {
      // Appel de la fonction getMovieDetails pour obtenir les détails du film
      getMovieDetails(imdbID)
        .then(movie => openPopup(movie))
        .catch(error => console.error('Erreur lors de l\'affichage des détails du film :', error));
    } else {
      console.error('ID IMDb non défini.');
    }
  }
});

// Fonction pour ouvrir une popup avec les détails du film
function openPopup(movie) {
  // Création d'un élément de modal
  const modal = document.createElement('div');
  modal.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'flex', 'items-center', 'justify-center', 'animate__animated', 'animate__fadeInUp');

  // Remplissage du contenu de la popup avec les détails du film
  modal.innerHTML = `
      <div class="bg-white p-8 rounded shadow-lg flex flex-col animate__animated animate__fadeInUp">
          <h2 class="text-2xl font-bold mb-4">${movie.title}</h2>
          <div class="flex justify-end mb-4">
              <img src="${movie.poster}" alt="${movie.title}" class="mr-4 mb-4">
              <div class="flex flex-col">
                  <p class="text-gray-600">Date de sortie: ${movie.year}</p>
                  <p class="text-gray-800">${movie.summary}</p>
                  <!-- Ajoute d'autres informations ici -->
              </div>
          </div>
          <button class="bg-blue-500 text-white p-2 rounded self-end" id="closePopup">Fermer</button>
      </div>
  `;

  // Ajout de la popup au corps du document
  document.body.appendChild(modal);

  // Ajoutons un événement pour fermer la popup lors du clic sur le bouton "Fermer"
  const closePopupButton = modal.querySelector('#closePopup');
  closePopupButton.addEventListener('click', function () {
      document.body.removeChild(modal);
  });
}
