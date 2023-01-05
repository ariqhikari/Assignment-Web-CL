import {
  getCategories,
  getCategoryByName,
  getDetailMeal,
  getRandomMeal,
} from './function.js';

$(document).ready(() => {
  const pathName = window.location.pathname;

  if (pathName.includes('index.html')) {
    getRandomMeal();
    getCategories();
    getCategoryByName('Super Delicious', 'Chicken', 6);
    getCategoryByName('Sweet Taste', 'Dessert', 6);
  }

  if (pathName.includes('category.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    getCategoryByName(`${category} Category`, category);
  }

  if (pathName.includes('detail.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const id = urlParams.get('id');

    getDetailMeal(category, id);
    getCategoryByName('You might also like', category, 6);
  }
});
