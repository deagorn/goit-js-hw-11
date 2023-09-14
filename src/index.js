
import SimpleLightbox from 'simplelightbox'; 
import 'simplelightbox/dist/simple-lightbox.min.css'; 
import { Notify } from 'notiflix/build/notiflix-notify-aio'; 
import { getImages} from './search-api'; 


const form = document.querySelector('.search-form'); 
const gallery = document.querySelector('.gallery'); 
const loadBtn = document.querySelector('.load-more'); 
const searchBtn = document.querySelector('.search-form'); 

searchBtn.disabled = true;
loadBtn.classList.add('is-hidden');

let query = '';
let page = 0;
let per_page = 40;
let totalPage = 1;

let lightbox = new SimpleLightbox('.gallery a', { 
    captionsData: 'alt',
    navText: ['&#10094;', '&#10095;'],
});
  
form.addEventListener('input', onInputForm); 
form.addEventListener('submit', onSubmit); 
loadBtn.addEventListener('click', onClickLoad); 

  // Cтворення розмітки
function renderGallery(array) {
  const galleryList = array
    .map(
      ({
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) =>
        `<div class="photo-card">
        <a href=${largeImageURL}>
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200" />
        </a>
        <div class="info">
          <p class="info-item">
            <b> Likes </b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views </b>
            ${views}
          </p>
          <p class="info-item">
            <b>Comments </b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads </b>
            ${downloads}
          </p>
        </div>
      </div>`
    )
    .join('');
  
  gallery.insertAdjacentHTML('beforeend', galleryList);
  lightbox.refresh();
}



function onInputForm(event) {
  event.preventDefault(); 

  searchBtn.disabled = true;
  const userInput = event.target.value.trim(); 
  if (userInput.trim() !== '') {
    searchBtn.disabled = false;
  }
}



async function onSubmit(event) { 

  event.preventDefault();

  loadBtn.classList.add('is-hidden');
  gallery.innerHTML = '';
  page = 1;
  query = form.elements.searchQuery.value;

    try {
      let response = await getImages(page, query);
 
      totalPage = Math.ceil(response.data.totalHits / per_page);

      renderGallery(response.data.hits);

      if (response.data.total === 0) {  
        Notify.failure( 
          `Sorry, there are no images matching your search query. Please try again.`
        );
      }

      if (response.data.totalHits > 0) {
        Notify.info(`Hooray! We found ${response.data.totalHits} images.`);

        if (response.data.totalHits <= per_page) {
          loadBtn.classList.add('is-hidden'); 
        }else{
          loadBtn.classList.remove('is-hidden');
          }
        }
    } catch (error) {
      console.log(error);
        Notify.failure(`Oops, something went wrong`); 
    } 
    
  lightbox.refresh();
}



async function onClickLoad() {
  page += 1; 
  
  if (page === totalPage) {
    loadBtn.classList.add('is-hidden'); 

     Notify.failure( 
          `We're sorry, but you've reached the end of search results.`
        );
  }

  try {
    const response = await getImages(page, query);

    renderGallery(response.data.hits); 

    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({  
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error);
    Notify.failure(`Oops, something went wrong`);
  }
}
