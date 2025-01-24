// script.js

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
    });
  }
  updateAvailableSeats();
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

  routeData.availableSeatsByDate[formattedDate] = routeData.availableSeatsByDate[formattedDate] || totalSeats;
  routeData.reservedSeatsByDate[formattedDate] = routeData.reservedSeatsByDate[formattedDate] || [];

  const reservedSeats = routeData.reservedSeatsByDate[formattedDate];
  let seatsVisible = false; // Flag to track if seats are shown

  for (let i = 1; i <= totalSeats; i++) {
    const seatElement = document.createElement("div");
    seatElement.classList.add("seat");
    seatElement.textContent = i;

    if (reservedSeats.includes(i)) {
      seatElement.classList.add("reserved");
    } else if (bookingState.selectedSeats.includes(i)) {
      seatElement.classList.add("selected");
    } else {
      seatElement.classList.add("available");
      seatElement.addEventListener("click", toggleSeatSelection);
      seatsVisible = true; // Seats are available, set flag to true
    }

    seatGrid.appendChild(seatElement);
  }

  // Show "Save Reservation" button only if seats are available
  document.getElementById("save-reservation").style.display = seatsVisible ? "block" : "none";
}

// Toggle seat selection
function toggleSeatSelection(event) {
  const selectedSeat = event.target;
  const seatNumber = parseInt(selectedSeat.textContent);

  if (bookingState.selectedSeats.includes(seatNumber)) {
    bookingState.selectedSeats = bookingState.selectedSeats.filter(seat => seat !== seatNumber);
    selectedSeat.classList.remove("selected");
    selectedSeat.classList.add("available");
  } else {
    if (bookingState.selectedSeats.length < bookingState.passengersToReserve) {
      bookingState.selectedSeats.push(seatNumber);
      selectedSeat.classList.remove("available");
      selectedSeat.classList.add("selected");
    } else {
      alert(`You can only select ${bookingState.passengersToReserve} seats.`);
    }
  }
}

// Save reserved seats
function saveReservation() {
  const { route, date, selectedSeats } = bookingState;

  if (!route || !date || selectedSeats.length === 0) {
    alert("Please select seats before saving the reservation.");
    return;
  }

  const routeData = busRoutes[route];
  const reservedSeats = routeData.reservedSeatsByDate[date];

  selectedSeats.forEach(seat => {
    if (!reservedSeats.includes(seat)) {
      reservedSeats.push(seat);
    }
  });

  // Ensure only the reserved seats reduce the availability
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

  if (departureDate >= currentDate) {
    const passengers = parseInt(document.getElementById("passengers").value);

    if (busRoute && passengers) {
      const routeData = busRoutes[busRoute];
      const formattedDate = departureDate.toISOString().slice(0, 10);

      routeData.availableSeatsByDate[formattedDate] =
        routeData.availableSeatsByDate[formattedDate] || routeData.totalSeats;
      routeData.reservedSeatsByDate[formattedDate] =
        routeData.reservedSeatsByDate[formattedDate] || [];

      const availableSeats = routeData.availableSeatsByDate[formattedDate];

      if (passengers <= availableSeats) {
        bookingState.route = busRoute;
        bookingState.date = formattedDate;
        bookingState.passengersToReserve = passengers;
        bookingState.selectedSeats = [];

        updateAvailableSeats();
        alert(`Please select ${passengers} seats to reserve.`);
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
