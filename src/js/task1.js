import gallery from './gallery-items.js';

const galleryEl = document.querySelector('.js-gallery');
const closeBtn = document.querySelector('button[data-action="close-lightbox"]');
const modalEl = document.querySelector('.js-lightbox');
const modalImgEl = document.querySelector('.lightbox__image');
const overlayEl = document.querySelector('.lightbox__overlay');

const galleryCardsMarkup = createGalleryCardsMarkup(gallery);
galleryEl.insertAdjacentHTML('beforeend', galleryCardsMarkup);

function createGalleryCardsMarkup(items) {
  return items
    .map(({ preview, original, description }, index) => {
      return `
        <li class="gallery__item">
        <a class="gallery__link"
        href="${original}"
        >
        <img
            data-index="${index}"
            class="gallery__image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
        />
    </a>
</li>
`;
    })
    .join('');
}

galleryEl.addEventListener('click', onGalleryItemClick);

function onGalleryItemClick(e) {
  e.preventDefault();
  if (e.target.tagName !== 'IMG') {
    return;
  }
  onOpenModal(e);
}

function onOpenModal(e) {
  window.addEventListener('keydown', onEscCloseModal);
  galleryEl.addEventListener('keydown', onClickImageSlider);

  modalEl.classList.add('is-open');
  setImageAttribute(e);
}

function setImageAttribute(e) {
  modalImgEl.src = e.target.dataset.source;
  modalImgEl.alt = e.target.alt;
  modalImgEl.setAttribute('data-index', e.target.dataset.index);
}

modalEl.addEventListener('click', onOverlayAndBtnClick);

function onCloseModal() {
  window.removeEventListener('keydown', onEscCloseModal);
  galleryEl.removeEventListener('keydown', onClickImageSlider);
  modalEl.classList.remove('is-open');
  unsetImageAttributes();
}

function unsetImageAttributes() {
  modalImgEl.src = '';
  modalImgEl.alt = '';
}

function onOverlayAndBtnClick(e) {
  if (e.target === overlayEl || e.target === closeBtn) {
    onCloseModal();
  }
}

function onEscCloseModal(e) {
  if (e.code === 'Escape') {
    onCloseModal();
  }
}

function onClickImageSlider(e) {
  const {
    dataset: { index },
  } = modalImgEl;
  const parsedIndex = parseInt(index);
  const firstChild = 0;
  const lastChild = gallery.length - 1;

  if (e.code === 'ArrowRight') {
    const newIndex = parsedIndex === lastChild ? firstChild : parsedIndex + 1;
    setNewAttributes(newIndex);
  }

  if (e.code === 'ArrowLeft') {
    const newIndex = parsedIndex === firstChild ? lastChild : parsedIndex - 1;
    setNewAttributes(newIndex);
  }
}

function setNewAttributes(newIndex) {
  const { original, description } = gallery[newIndex];
  modalImgEl.src = original;
  modalImgEl.alt = description;
  modalImgEl.dataset.index = newIndex;
}
