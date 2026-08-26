document.addEventListener("DOMContentLoaded", () => {
  const bilder = Array.isArray(window.BILDER) ? window.BILDER : [];
  const galleries = document.querySelectorAll("[data-gallery]");

  // Oppdater årstallet i footeren
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  if (bilder.length === 0) {
    console.error(
      "Ingen bilder ble funnet. Kontroller at bilder.js lastes før script.js."
    );

    galleries.forEach((gallery) => {
      gallery.innerHTML =
        '<p class="gallery-message">Ingen bilder kunne lastes.</p>';
    });

    return;
  }

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector(".lightbox-content img");
  const lightboxTitle = lightbox?.querySelector(".lightbox-title");
  const lightboxMeta = lightbox?.querySelector(".lightbox-meta");
  const closeButton = lightbox?.querySelector(".lightbox-close");
  const previousButton = lightbox?.querySelector(".lightbox-prev");
  const nextButton = lightbox?.querySelector(".lightbox-next");

  let activeImages = [];
  let activeIndex = 0;

  function openLightbox(images, index) {
    if (!lightbox || images.length === 0) return;

    activeImages = images;
    activeIndex = index;

    updateLightbox();

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
  }

  function updateLightbox() {
    const bilde = activeImages[activeIndex];

    if (!bilde || !lightboxImage) return;

    lightboxImage.src = bilde.fil;
    lightboxImage.alt = bilde.tittel || "Naturbilde";

    if (lightboxTitle) {
      lightboxTitle.textContent = bilde.tittel || "";
    }

    if (lightboxMeta) {
      lightboxMeta.textContent = bilde.sted || "";
    }
  }

  function showPreviousImage() {
    if (activeImages.length === 0) return;

    activeIndex =
      (activeIndex - 1 + activeImages.length) % activeImages.length;

    updateLightbox();
  }

  function showNextImage() {
    if (activeImages.length === 0) return;

    activeIndex = (activeIndex + 1) % activeImages.length;

    updateLightbox();
  }

  function closeLightbox() {
    if (!lightbox) return;

    if (typeof lightbox.close === "function") {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
    }
  }

  function createGalleryItem(bilde, images, index) {
    const article = document.createElement("article");
    article.className = `gallery-item ${bilde.format || "standard"}`;
    article.dataset.category = bilde.kategori || "";

    const button = document.createElement("button");
    button.className = "gallery-image-button";
    button.type = "button";
    button.setAttribute(
      "aria-label",
      `Vis ${bilde.tittel || "bildet"} i større format`
    );

    const image = document.createElement("img");
    image.src = bilde.fil;
    image.alt = bilde.tittel || "Naturbilde";
    image.loading = "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
      console.error(`Bildet kunne ikke lastes: ${bilde.fil}`);
      article.classList.add("image-error");
    });

    button.appendChild(image);

    const text = document.createElement("div");
    text.className = "gallery-item-text";

    const title = document.createElement("h3");
    title.textContent = bilde.tittel || "";

    text.appendChild(title);

    if (bilde.sted) {
      const place = document.createElement("p");
      place.textContent = bilde.sted;
      text.appendChild(place);
    }

    button.addEventListener("click", () => {
      openLightbox(images, index);
    });

    article.appendChild(button);
    article.appendChild(text);

    return article;
  }

  function renderGallery(gallery, selectedCategory = "alle") {
    const featuredOnly = gallery.dataset.featuredOnly === "true";

    let visibleImages = featuredOnly
      ? bilder.filter((bilde) => bilde.utvalgt === true)
      : [...bilder];

    if (selectedCategory !== "alle") {
      visibleImages = visibleImages.filter(
        (bilde) => bilde.kategori === selectedCategory
      );
    }

    gallery.innerHTML = "";

    if (visibleImages.length === 0) {
      gallery.innerHTML =
        '<p class="gallery-message">Ingen bilder i denne kategorien.</p>';
      return;
    }

    visibleImages.forEach((bilde, index) => {
      gallery.appendChild(
        createGalleryItem(bilde, visibleImages, index)
      );
    });
  }

  galleries.forEach((gallery) => {
    renderGallery(gallery);
  });

  // Støtter eventuelle kategoriknapper i galleriet
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter || "alle";

      document.querySelectorAll("[data-filter]").forEach((filterButton) => {
        filterButton.classList.remove("active");
        filterButton.removeAttribute("aria-current");
      });

      button.classList.add("active");
      button.setAttribute("aria-current", "true");

      galleries.forEach((gallery) => {
        if (gallery.dataset.featuredOnly !== "true") {
          renderGallery(gallery, category);
        }
      });
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  previousButton?.addEventListener("click", showPreviousImage);
  nextButton?.addEventListener("click", showNextImage);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox?.hasAttribute("open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPreviousImage();
    }

    if (event.key === "ArrowRight") {
      showNextImage();
    }
  });
});
