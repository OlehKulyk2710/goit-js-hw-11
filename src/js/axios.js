export { getData, elementsPerPage };

import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {
  key: '27709909-07a568606c22c989f1d028a2c',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  page: 1,
  per_page: 40,
};

const elementsPerPage = options.per_page;

let prevSearchQuery = '';

async function getData(searchQuery) {
  if (prevSearchQuery !== searchQuery) {
    prevSearchQuery = searchQuery;
    options.page = 1;
  }

  let response;

  try {
    response = await axios.get(
      `https://pixabay.com/api/?key=${options.key}&q=${searchQuery}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${options.page}&per_page=${options.per_page}`
    );
  } catch {
    Notify.failure('Urgent. Lyolik, vse propalo!!!', {
      position: 'center-top',
      distance: '70px',
      timeout: 5000,
    });
    // const error = new Error('Urgent. Lyolik, vse propalo!!!');
    // console.dir(error.message);
  }

  options.page += 1;

  return response;
}
