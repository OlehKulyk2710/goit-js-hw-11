import { getData, elementsPerPage } from './js/axios';
import { resetForm } from './js/reset-form';
import { createMarkup } from './js/markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { smoothScroll } from './js/smooth-scroll';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let gallery = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.gallery.addEventListener('click', event => event.preventDefault());

let prevInputValue = '';
let totalHits = 0;
let pageCounter = 0;

refs.searchForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const inputValue = event.currentTarget.elements.searchQuery.value.trim();

  if (prevInputValue === inputValue) {
    return;
  } else {
    refs.gallery.innerHTML = '';
    totalHits = 0;
    pageCounter = 1;
  }

  prevInputValue = inputValue;
  makeRequest(inputValue);
}

function makeRequest(inputValue) {
  refs.btnLoadMore.classList.remove('isActive');
  getData(inputValue)
    .then(value => {
      // console.log(value);
      const data = value.data.hits;
      if (!data.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'center-top',
            distance: '70px',
            timeout: 2000,
          }
        );

        resetForm(refs.searchForm);
        return;
      }

      if (value.data.totalHits > totalHits) {
        totalHits = value.data.totalHits;
        Notify.success(`Hooray! We found ${totalHits} images.`, {
          position: 'center-top',
          distance: '70px',
          timeout: 3000,
        });
      }

      const markup = createMarkup(data);

      refs.gallery.insertAdjacentHTML('beforeend', markup);
      gallery.refresh();

      if (pageCounter >= 2) {
        smoothScroll();
      }

      if (data.length < elementsPerPage) {
        refs.btnLoadMore.classList.remove('isActive');
        Notify.success(
          "We're sorry, but you've reached the end of search results.",
          {
            position: 'center-top',
            distance: '70px',
            timeout: 3000,
          }
        );
      } else {
        refs.btnLoadMore.classList.add('isActive');
      }
    })
    .catch(error => {
      console.log(error.message);
      return;
    });
}

refs.btnLoadMore.addEventListener('click', onClickBtn);

function onClickBtn() {
  makeRequest(prevInputValue);
  pageCounter += 1;
}
