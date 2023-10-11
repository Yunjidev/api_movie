const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          observer.unobserve(entry.target); // On n'a plus besoin d'observer cet élément
      }
  });
}, { threshold: 0.5 }); // On considère qu'un élément est visible s'il est à 50% ou plus dans le viewport

// Observer tous les éléments avec la classe .opacity-0
document.querySelectorAll('.opacity-0').forEach(item => {
  observer.observe(item);
});
