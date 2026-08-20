const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("p");
const closeButton = lightbox.querySelector(".lightbox-close");

document.querySelectorAll(".photo-card").forEach((card) => {
  const button = card.querySelector(".photo-button");
  const image = card.querySelector("img");
  const caption = card.querySelector("figcaption span");

  button.addEventListener("click", () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption.textContent;
    lightbox.showModal();
  });
});

closeButton.addEventListener("click", () => lightbox.close());

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
