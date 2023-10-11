// Création d'un observateur d'intersection pour détecter lorsque les éléments deviennent visibles dans le viewport
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // Vérifie si l'élément est en cours d'intersection avec le viewport
    if (entry.isIntersecting) {
      // Ajoute la classe 'opacity-100' pour rendre l'élément visible
      entry.target.classList.add('opacity-100');
      
      // On arrête d'observer cet élément une fois qu'il est devenu visible
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 }); // On considère qu'un élément est visible s'il est à 50% ou plus dans le viewport

// Observer tous les éléments avec la classe .opacity-0
document.querySelectorAll('.opacity-0').forEach(item => {
  // Ajout de chaque élément à l'observateur d'intersection
  observer.observe(item);
});
