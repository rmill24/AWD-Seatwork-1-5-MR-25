document.addEventListener('DOMContentLoaded', () => {
  // Create hamburger menu element
  const header = document.querySelector('header');
  const navBar = document.querySelector('.nav-bar');
  const navList = navBar.querySelector('ul');

  const hamburgerMenu = document.createElement('div');
  hamburgerMenu.classList.add('hamburger-menu');
  hamburgerMenu.innerHTML = `
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
  `;

  // Insert hamburger menu into header
  header.appendChild(hamburgerMenu);

  // Toggle menu function
  hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      navList.classList.toggle('active');

      // Prevent scrolling when menu is open
      document.body.style.overflow = navList.classList.contains('active') 
          ? 'hidden' 
          : 'auto';
  });

  // Close menu when a nav link is clicked
  navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
          hamburgerMenu.classList.remove('active');
          navList.classList.remove('active');
          document.body.style.overflow = 'auto';
      });
  });

  // Close menu if clicked outside
  document.addEventListener('click', (event) => {
      if (!header.contains(event.target) && 
          navList.classList.contains('active')) {
          hamburgerMenu.classList.remove('active');
          navList.classList.remove('active');
          document.body.style.overflow = 'auto';
      }
  });
});

// parallax
let text = document.getElementById('parallax-text-container');

window.addEventListener('scroll', ()  => {
  let value = window.scrollY;

  text.style.marginTop = value * 2 + 'px';
});

// Bus route details with available seats
const busRoutes = {
  "sm-fairview-pitx": {
    totalSeats: 5,
    availableSeatsByDate: {},
    reservedSeatsByDate: {}
  },
  "one-ayala-ayala-solenad": {
    totalSeats: 5,
    availableSeatsByDate: {},
    reservedSeatsByDate: {}
  },
  "pitx-bgc": {
    totalSeats: 5,
    availableSeatsByDate: {},
    reservedSeatsByDate: {}
  }
};

// Booking state management
const bookingState = {
  route: null,
  date: null,
  passengersToReserve: 0,
  selectedSeats: [],
  reset() {
    this.route = null;
    this.date = null;
    this.passengersToReserve = 0;
    this.selectedSeats = [];
  }
};

// Load bus route data from localStorage on page load
function loadBusRouteData() {
  const storedData = localStorage.getItem("busRoutes");
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    Object.keys(busRoutes).forEach(route => {
      busRoutes[route].availableSeatsByDate = { ...parsedData[route]?.availableSeatsByDate };
      busRoutes[route].reservedSeatsByDate = { ...parsedData[route]?.reservedSeatsByDate };

      // Ensure each date has the correct number of available seats
      Object.keys(busRoutes[route].reservedSeatsByDate).forEach(date => {
        const reservedSeats = busRoutes[route].reservedSeatsByDate[date];
        busRoutes[route].availableSeatsByDate[date] = 
          busRoutes[route].totalSeats - (reservedSeats || []).length;
      });
    });
  }
  updateAvailableSeats();
}

// Modify saveReservation to correctly track available seats
function saveReservation() {
  const { route, date, selectedSeats, passengersToReserve } = bookingState;

  if (!route || !date || selectedSeats.length === 0) {
    alert("Please select seats before saving the reservation.");
    return;
  }

  // Check if the number of selected seats matches the number of passengers
  if (selectedSeats.length !== passengersToReserve) {
    alert(`Please select exactly ${passengersToReserve} seat(s) for your reservation.`);
    return;
  }

  const routeData = busRoutes[route];
  const reservedSeats = routeData.reservedSeatsByDate[date] || [];

  selectedSeats.forEach(seat => {
    if (!reservedSeats.includes(seat)) {
      reservedSeats.push(seat);
    }
  });

  // Update reserved seats for the specific date
  routeData.reservedSeatsByDate[date] = reservedSeats;

  // Correctly calculate and set available seats
  routeData.availableSeatsByDate[date] = routeData.totalSeats - reservedSeats.length;

  bookingState.reset();

  saveBusRouteData();
  updateAvailableSeats();
  alert("Reservation saved successfully!");
}

// Save bus route data to localStorage
function saveBusRouteData() {
  localStorage.setItem("busRoutes", JSON.stringify(busRoutes));
}

// Update the available seats grid
function updateAvailableSeats() {
  const seatGrid = document.getElementById("seat-grid");
  seatGrid.innerHTML = "";

  const selectedRoute = document.getElementById("bus-route").value;
  const selectedDate = new Date(document.getElementById("departure-date").value);
  const formattedDate = selectedDate.toISOString().slice(0, 10);
  const routeData = busRoutes[selectedRoute];
  const totalSeats = routeData.totalSeats;

  // Ensure date-specific data exists with correct initial values
  routeData.availableSeatsByDate[formattedDate] = 
    routeData.availableSeatsByDate[formattedDate] || totalSeats;
  routeData.reservedSeatsByDate[formattedDate] = 
    routeData.reservedSeatsByDate[formattedDate] || [];

  const reservedSeats = routeData.reservedSeatsByDate[formattedDate];
  const availableSeats = routeData.totalSeats - reservedSeats.length;
  let seatsVisible = false;

  for (let i = 1; i <= totalSeats; i++) {
    const seatElement = document.createElement("div");
    seatElement.classList.add("seat");
    seatElement.textContent = i;

    if (reservedSeats.includes(i)) {
      seatElement.classList.add("reserved");
    } else if (bookingState.selectedSeats.includes(i)) {
      seatElement.classList.add("selected");
    } else if (availableSeats > 0) {
      seatElement.classList.add("available");
      seatElement.addEventListener("click", toggleSeatSelection);
      seatsVisible = true;
    }

    seatGrid.appendChild(seatElement);
  }

  // Show "Save Reservation" button only if seats are available
  document.getElementById("save-reservation").style.display = seatsVisible ? "block" : "none";
}

// Modify toggleSeatSelection to prevent selecting more seats than available
function toggleSeatSelection(event) {
  const selectedSeat = event.target;
  const seatNumber = parseInt(selectedSeat.textContent);

  const selectedRoute = document.getElementById("bus-route").value;
  const selectedDate = new Date(document.getElementById("departure-date").value);
  const formattedDate = selectedDate.toISOString().slice(0, 10);
  const routeData = busRoutes[selectedRoute];
  const reservedSeats = routeData.reservedSeatsByDate[formattedDate];
  const availableSeats = routeData.availableSeatsByDate[formattedDate];

  // Calculate remaining available seats
  const remainingAvailableSeats = availableSeats - reservedSeats.length;

  if (bookingState.selectedSeats.includes(seatNumber)) {
    // Deselect seat
    bookingState.selectedSeats = bookingState.selectedSeats.filter(seat => seat !== seatNumber);
    selectedSeat.classList.remove("selected");
    selectedSeat.classList.add("available");
  } else {
    // Check if we can select more seats
    if (bookingState.selectedSeats.length < bookingState.passengersToReserve &&
        bookingState.selectedSeats.length < remainingAvailableSeats) {
      bookingState.selectedSeats.push(seatNumber);
      selectedSeat.classList.remove("available");
      selectedSeat.classList.add("selected");
    } else {
      alert(`You can only select ${Math.min(bookingState.passengersToReserve, remainingAvailableSeats)} seats.`);
    }
  }
}

// Save reserved seats
function saveReservation() {
  const { route, date, selectedSeats, passengersToReserve } = bookingState;

  if (!route || !date || selectedSeats.length === 0) {
    alert("Please select seats before saving the reservation.");
    return;
  }

  // Check if the number of selected seats matches the number of passengers
  if (selectedSeats.length !== passengersToReserve) {
    alert(`Please select exactly ${passengersToReserve} seat(s) for your reservation.`);
    return;
  }

  const routeData = busRoutes[route];
  const reservedSeats = routeData.reservedSeatsByDate[date] || [];

  selectedSeats.forEach(seat => {
    if (!reservedSeats.includes(seat)) {
      reservedSeats.push(seat);
    }
  });

  // Recalculate available seats based on total seats and reserved seats
  routeData.reservedSeatsByDate[date] = reservedSeats;
  routeData.availableSeatsByDate[date] = routeData.totalSeats - reservedSeats.length;

  bookingState.reset();

  saveBusRouteData();
  updateAvailableSeats();
  alert("Reservation saved successfully!");
}

// Handle ticket booking
function bookTickets() {
  const busRoute = document.getElementById("bus-route").value;
  const departureDate = new Date(document.getElementById("departure-date").value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if the selected departure date is in the present or future
  if (departureDate >= currentDate) {
    const passengers = parseInt(document.getElementById("passengers").value);

    if (busRoute && passengers) {
      const routeData = busRoutes[busRoute];
      const formattedDate = departureDate.toISOString().slice(0, 10);

      // Ensure date-specific data exists with correct initial values
      routeData.availableSeatsByDate[formattedDate] = 
        routeData.availableSeatsByDate[formattedDate] || routeData.totalSeats;
      routeData.reservedSeatsByDate[formattedDate] = 
        routeData.reservedSeatsByDate[formattedDate] || [];

      // Dynamically calculate available seats
      const totalReservedSeats = routeData.reservedSeatsByDate[formattedDate].length;
      const currentAvailableSeats = routeData.totalSeats - totalReservedSeats;

      // New validation: Check if requested passengers exceed available seats
      if (passengers > currentAvailableSeats) {
        alert(`Sorry, you requested ${passengers} passengers, but only ${currentAvailableSeats} seat(s) are available for this route and date.`);
        return;
      }

      // Check if there are any seats available
      if (currentAvailableSeats <= 0) {
        alert("Sorry, there are no available seats for this route and date.");
        return;
      }

      // Ensure passengers doesn't exceed available seats
      const seatsToBook = Math.min(passengers, currentAvailableSeats);

      if (seatsToBook > 0) {
        bookingState.route = busRoute;
        bookingState.date = formattedDate;
        bookingState.passengersToReserve = seatsToBook;
        bookingState.selectedSeats = [];

        updateAvailableSeats();
        alert(`Please select ${seatsToBook} seats to reserve.`);
      } else {
        alert("Sorry, there are not enough available seats for your request.");
      }
    } else {
      alert("Please fill in all the required fields.");
    }
  } else {
    alert("You cannot book seats for a date in the past.");
  }
}

// Add event listeners
document.getElementById("bus-route").addEventListener("change", updateAvailableSeats);
document.getElementById("departure-date").addEventListener("change", updateAvailableSeats);
document.getElementById("save-reservation").addEventListener("click", saveReservation);

// Initialize data on page load
loadBusRouteData();
