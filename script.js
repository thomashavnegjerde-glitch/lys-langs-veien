const allPhotos = Array.isArray(window.BILDER) ? window.BILDER : [];
const galleryContainers = document.querySelectorAll("[data-gallery]");
const lightbox = document.querySelector(".lightbox");
let visiblePhotos = [];
let currentPhotoIndex = 0;

function photoCard(photo, position) {
  const figure = document.createElement("figure");
  const formatClass = photo.format === "wide" ? " photo-card--wide" : photo.format === "tall" ? " photo-card--tall" : "";
  figure.className = `photo-card${formatClass}`;
  figure.innerHTML = `
    <button class="photo-button" type="button" aria-label="Vis ${photo.tittel} større">
      <span class="missing-image" aria-hidden="true">Bildet kunne ikke lastes</span>
      <img src="${photo.fil}" alt="${photo.tittel}" loading="lazy" />
    </button>
    <figcaption><span>${photo.tittel}</span><span>${photo.sted || ""}</span></figcaption>`;
  const image = figure.querySelector("img");
  image.addEventListener("error", () => figure.classList.add("has-image-error"));
  figure.querySelector("button").addEventListener("click", () => openLightbox(position));
  return figure;
}

function renderGallery(container, photos) {
  container.replaceChildren();
  visiblePhotos = photos;
  photos.forEach((photo, position) => container.append(photoCard(photo, position)));
}

galleryContainers.forEach((container) => {
  const photos = container.dataset.featuredOnly === "true" ? allPhotos.filter((photo) => photo.utvalgt) : allPhotos;
  renderGallery(container, photos);
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    const photos = filter === "alle" ? allPhotos : allPhotos.filter((photo) => photo.kategori === filter);
    renderGallery(document.querySelector(".gallery--all"), photos);
  });
});

function showCurrentPhoto() {
  if (!lightbox || !visiblePhotos.length) return;
  const photo = visiblePhotos[currentPhotoIndex];
  const image = lightbox.querySelector("img");
  image.src = photo.fil;
  image.alt = photo.tittel;
  lightbox.querySelector(".lightbox-title").textContent = photo.tittel;
  lightbox.querySelector(".lightbox-meta").textContent = photo.sted || "";
}

function openLightbox(position) {
  if (!lightbox) return;
  currentPhotoIndex = position;
  showCurrentPhoto();
  lightbox.showModal();
}

function moveLightbox(direction) {
  currentPhotoIndex = (currentPhotoIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  showCurrentPhoto();
}

if (lightbox) {
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => moveLightbox(-1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => moveLightbox(1));
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;
    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
  });
}

document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });
