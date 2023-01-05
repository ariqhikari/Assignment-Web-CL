// Api Categories : https://www.themealdb.com/api/json/v1/1/categories.php
// Api Detail Category : https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}
// Api Random Meal : https://www.themealdb.com/api/json/v1/1/random.php
// Api Detail Meal : https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}

// Fetching Data
export const getCategories = () => {
  $.ajax({
    url: 'https://www.themealdb.com/api/json/v1/1/categories.php',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
      response.categories.map((item) => {
        renderCategories(item);
      });
    },
    fail: (err) => {
      console.error(err.message);
    },
  });
};

export const getCategoryByName = (title, category, limit) => {
  $.ajax({
    url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
    type: 'GET',
    dataType: 'json',
    success: (response) => {
      $('.list-meals-wrapper .container').append(
        `<div class="list-meals ${category}">
          <h2>${title}</h2> 
          <div class="flex flex-wrap gap-2"></div>
        </div>`
      );

      let meals = response.meals;

      if (limit) {
        meals = meals.slice(0, limit);
      }

      meals.map((item) => {
        renderCategoryByName(item, category);
      });

      init();
      removeLoading();
    },
    fail: (err) => {
      console.error(err.message);
    },
  });
};

export const getRandomMeal = () => {
  $.ajax({
    url: 'https://www.themealdb.com/api/json/v1/1/random.php',
    type: 'GET',
    dataType: 'json',
    success: (response) => {
      renderRandomMeal(response.meals[0]);
    },
    fail: (err) => {
      console.error(err.message);
    },
  });
};

export const getDetailMeal = (category, id) => {
  $.ajax({
    url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    type: 'GET',
    dataType: 'json',
    success: (response) => {
      const detail = response.meals[0];

      $.ajax({
        url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
          const otherMeals = response.meals.slice(
            Math.max(response.meals.length - 5, 1)
          );

          renderDetailMeal(category, detail, otherMeals);

          init();
          removeLoading();
        },
      });
    },
    fail: (err) => {
      console.error(err.message);
    },
  });
};

// General
const strippedContent = (content, length = 100) => {
  let regex = /(<([^>]+)>)/gi;
  if (content.length > length)
    return content.replace(regex, '').substring(0, length) + '..';
  return content.replace(regex, '').substring(0, length);
};

export const init = () => {
  const links = document.querySelectorAll('a');
  const transition_el = document.querySelector('.transition');

  if (transition_el) {
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = link.href;

        if (
          target.includes('html') &&
          !target.includes('#') &&
          !link.classList.contains('external')
        ) {
          e.preventDefault();
          transition_el.classList.add('is-active');

          setInterval(() => {
            window.location.href = target;
          }, 750);
        }
      });
    });
  }
};

export const removeLoading = () => {
  const loading = document.querySelector('.loading-wrap');

  setTimeout(() => {
    loading.classList.add('slide');
    document.body.classList.remove('overflow-hidden');
  }, 500);
};

// Render Elements
const renderCategories = (item) => {
  $('.popular-categories .flex').append(
    `<a href="./category.html?category=${item.strCategory}" class="category">
      <div class="img">
        <img
          src="${item.strCategoryThumb}"
          alt="${item.strCategory}"
          width="100%"
          height="100%"
          class="object-cover"
        />
      </div>

      <h3>${item.strCategory}</h3>
    </a>`
  );
};

const renderCategoryByName = (item, category) => {
  $(`.list-meals.${category} .flex`).append(
    `<a href="./detail.html?id=${item.idMeal}&category=${category}" class="meal">
        <div class="img">
          <img
            src="${item.strMealThumb}"
            alt="${item.strMeal}"
            width="100%"
            height="100%"
            class="object-cover"
          />
        </div>

        <h4>${category}</h4>
        <h3>${item.strMeal}</h3>
      </a>`
  );
};

const renderRandomMeal = (item) => {
  $('.jumbotron').append(
    `<a href="./detail.html?id=${item.idMeal}&category=${
      item.strCategory
    }" class="flex flex-wrap">
        <div class="banner">
          <img
            src="${item.strMealThumb}"
            alt="${item.strMeal}"
            class="object-cover"
            width="100%"
          />
        </div>

        <div class="desc">
          <div class="flex items-center gap-1 font-medium">
            <img src="./assets/img/ic_grow.svg" alt="Icon Grow" />
            85% would make this again
          </div>

          <h1>${item.strMeal}</h1>
          <p class="font-medium">
            ${strippedContent(item.strInstructions)}
          </p>
        </div>
      </a>`
  );
};

const renderDetailMeal = (category, item, otherMeals) => {
  $('.detail-meal').append(
    `<div class="flex items-center justify-between">
        <div class="flex items-center gap-1 font-medium">
          <img src="./assets/img/ic_grow.svg" alt="Icon Grow" />
          85% would make this again
        </div>

        <div class="flex items-center gap-1">
          <a title="Share" href="https://api.whatsapp.com/send?text=${
            item.strMeal
          } ${window.location.href}"  
            target="_blank" 
            rel="noopener" 
            class="text-decoration-none external">
            <img src="./assets/img/ic_share.svg" alt="Icon Share" />
          </a>
        </div>
      </div>

      <h1>${item.strMeal}</h1>
      <hr />

      ${renderThumbMeal(item)}

      <div class="detail">
        <div class="left">
          <div class="ingredients">
            <h2>Ingredients</h2>

            ${renderIngredients(item)}
          </div>

          <div class="instructions">
            <h2>Instructions</h2>

            <p>
              ${item.strInstructions}
            </p>
          </div>
        </div>

        <div class="right">
          <h2>Fresh Recipes</h2>
          ${renderOtherMeal(category, otherMeals)}
        </div>
      </div>`
  );
};

const renderThumbMeal = (item) => {
  let wrapper = '';

  if (item.strYoutube) {
    wrapper += `
      <iframe class="thumb" src="https://www.youtube.com/embed/${
        item.strYoutube.split('?v=')[1]
      }" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
  } else {
    wrapper += `
      <div class="thumb">
        <img 
        src="${item.strMealThumb}"
        alt="${item.strMeal}"
        class="object-cover"
        width="100%">
      </div>
    `;
  }

  return wrapper;
};

const renderIngredients = (item) => {
  let wrapper = `<ol>`;
  for (let i = 1; i <= 20; i++) {
    const ingredient = item[`strIngredient${i}`];

    if (ingredient) {
      wrapper += `
        <li>${ingredient}</li>
      `;
    }
  }
  wrapper += `</ol>`;

  return wrapper;
};

const renderOtherMeal = (category, otherMeals) => {
  let wrapper = '';

  otherMeals.forEach((item) => {
    wrapper += `
     <a href="${`./detail.html?id=${item.idMeal}&category=${category}`}" class="other-meal flex items-center gap-1">
      <div class="img">
        <img src="${item.strMealThumb}" alt="${item.strMeal}" />
      </div>

      <div>
        <h5>${category}</h5>
        <h4>${strippedContent(item.strMeal, 20)}</h4>
      </div>
    </a>
    `;
  });

  return wrapper;
};
