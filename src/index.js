import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-form__input');
const searchButton = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

let pageNumberCounter = 1;

let apiInfo = {
  accesKey: '32129140-b7bda5ae96b59391b71a1c3d8',
  perPage: 40,
  safeSearch: true,
  type: 'image',
  orientation: 'horizontal',
};
var lightbox = new SimpleLightbox('.gallery a');
const displayImgEl = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
      </p>
    </div>
  </div>`
  );
};

const getImages = async (searchValue, pageNumber) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${apiInfo.accesKey}&q=${searchValue}&image_type=${apiInfo.type}&orientation=${apiInfo.orientation}&safesearch=${apiInfo.safeSearch}&per_page=${apiInfo.perPage}&page=${pageNumber}`
    );

    const data = response.data.hits;

    data.forEach(image => {
      displayImgEl(image);
    });
    lightbox.refresh();
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 0.5,
      behavior: 'smooth',
    });
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

searchButton.addEventListener('submit', event => {
  gallery.innerHTML = '';
  event.preventDefault();
  if (searchInput.value == '') {
    return;
  } else {
    pageNumberCounter = 1;
    getImages(searchInput.value.trim(), pageNumberCounter);
  }
});

window.addEventListener('scroll', () => {
  console.log('scrolled', window.scrollY);
  console.log(window.innerHeight);
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    pageNumberCounter++;
    getImages(searchInput.value.trim(), pageNumberCounter);
  }
});
