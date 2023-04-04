// Define global variables
const filmsList = document.querySelector('#films');
const movieDetails = document.querySelector('#movie-details');
const buyButton = document.querySelector('#buy-button');

// Define constants
const BASE_URL = 'http://localhost:3000';
const FILMS_URL = `${BASE_URL}/films`;

// Define state
let selectedFilmId = null;

// Update the films list with the films from the server
const updateFilmsList = async () => {
  try {
    const response = await fetch(FILMS_URL);
    const films = await response.json();

    // Clear the previous list of films
    filmsList.innerHTML = '';

    // Loop over each film and create a new list item
    for (const film of films) {
      const filmItem = document.createElement('li');
      filmItem.classList.add('film', 'item');

      // If the film is sold out, add the 'sold-out' class and display the title
      if (film.tickets_sold === film.capacity) {
        filmItem.classList.add('sold-out');
        filmItem.textContent = film.title;

      // If the film is not sold out, create a link to show its details
      } else {
        const filmLink = document.createElement('a');
        filmLink.href = '#';
        filmLink.textContent = film.title;
        filmLink.addEventListener('click', () => showMovieDetails(film.id));
        filmItem.appendChild(filmLink);
      }

      // Add the new list item to the films list
      filmsList.appendChild(filmItem);
    }
  } catch (error) {
    console.error(error);
  }
};

// Show the details of the selected film
const showMovieDetails = async (filmId) => {
  try {
    const response = await fetch(`${FILMS_URL}/${filmId}`);
    const film = await response.json();

    // Update the selectedFilmId state variable
    selectedFilmId = film.id;

    // Update the movie details section with the film's details
    movieDetails.innerHTML = `
      <h2>${film.title}</h2>
      <img src="${film.poster}" alt="${film.title} Poster">
      <p><strong>Runtime:</strong> ${film.runtime} min</p>
      <p><strong>Showtime:</strong> ${film.showtime}</p>
      <p><strong>Description:</strong> ${film.description}</p>
      <p><strong>Tickets Available:</strong> ${film.capacity - film.tickets_sold}/${film.capacity}</p>
    `;

    // Update the buy button depending on whether the film is sold out or not
    if (film.tickets_sold === film.capacity) {
      buyButton.disabled = true;
      buyButton.textContent = 'Sold Out';
    } else {
      buyButton.disabled = false;
      buyButton.textContent = 'Buy Ticket';
    }
  } catch (error) {
    console.error(error);
  }
};

// Add event listener to all "Buy Ticket" buttons
const buyButtons = document.querySelectorAll('.buy-ticket');
buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const ticketType = button.getAttribute('data-ticket');
    buyTicket(ticketType);
  });
});

// Function to buy ticket
function buyTicket(ticketType) {
  // Code to buy ticket
  console.log(`Bought ${ticketType} ticket.`);
  alert(`Bought ${ticketType} ticket.`);
}

// Check if there are tickets available
if (currentTickets > 0) {
  // Decrease the available tickets by 1
  const newTickets = currentTickets - 1;
  availableTickets.textContent = newTickets;
  
  // Buy the ticket
  buyTicket(ticketType);
} else {
  console.log(`Sorry, no more tickets available for ${ticketType}.`);
  alert(`Sorry, no more tickets available for ${ticketType}.`);
}

// Add event listener to the buy button to buy a ticket for the selected film when clicked
buyButton.addEventListener('click', buyTicket);

// Update the films list with the initial films from the server
updateFilmsList();

// Add event listener to the refresh button to update the films list
const refreshButton = document.querySelector('#refresh-button');
refreshButton.addEventListener('click', updateFilmsList);

// Add event listener to the form to add a new film to the server
const addFilmForm = document.querySelector('#add-film-form');
addFilmForm.addEventListener('submit', async (event) => {
event.preventDefault();

try {
const response = await fetch(FILMS_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({
title: event.target.elements.title.value,
poster: event.target.elements.poster.value,
runtime: event.target.elements.runtime.value,
showtime: event.target.elements.showtime.value,
description: event.target.elements.description.value,
capacity: event.target.elements.capacity.value,
tickets_sold: 0
})
});
const film = await response.json();
updateFilmsList();
showMovieDetails(film.id);
addFilmForm.reset();
} catch (error) {
console.error(error);
}
});
