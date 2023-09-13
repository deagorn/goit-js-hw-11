import axios from 'axios'; // імпорт бібліотеки запитів на сервер

const BASE_URL = 'https://pixabay.com/api/';

async function getImages(page, query) { // функція отримання данних з серверу
  const params = new URLSearchParams({  // об'єкт для створення параметрів запиту
    key: '39076569-9cff8913da31274e2ad8311c4',
    page,
    per_page: 40,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  return response = await axios.get(`${BASE_URL}?${params}`); // об'єкт, що містить результати запиту
}

export { getImages}; // експортуємо функцію й змінну