document.addEventListener("DOMContentLoaded", () => {
  // Create hamburger menu element
  const header = document.querySelector("header");
  const navList = document.querySelector(".nav-bar ul");

  const hamburgerMenu = document.createElement("div");
  hamburgerMenu.classList.add("hamburger-menu");
  hamburgerMenu.innerHTML = `
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
  `;

  // Insert hamburger menu into header
  header.appendChild(hamburgerMenu);

  // Toggle menu function
  hamburgerMenu.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    navList.classList.toggle("active");

    // Prevent scrolling when menu is open
    document.body.style.overflow = navList.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  // Close menu when a nav link is clicked
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerMenu.classList.remove("active");
      navList.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });

  // Close menu if clicked outside
  document.addEventListener("click", (event) => {
    if (
      !header.contains(event.target) &&
      navList.classList.contains("active")
    ) {
      hamburgerMenu.classList.remove("active");
      navList.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  updateTotalPrice();
});

// parallax
let text = document.getElementById("parallax-text-container");

window.addEventListener("scroll", () => {
  let value = window.scrollY;

  text.style.marginTop = value * 2 + "px";
});

// Bus route details with available seats
const busRoutes = {
  "sm-fairview-pitx": {
    totalSeats: 5,
    availableSeatsByDate: {},
    reservedSeatsByDate: {},
  },
  "one-ayala-ayala-solenad": {
    totalSeats: 5,
    availableSeatsByDate: {},
    reservedSeatsByDate: {},
  },
  "pitx-bgc": {
    totalSeats: 5,
    availableSeatsByDate: {},
    reservedSeatsByDate: {},
  },
};

// Route Pricing
const routePricing = {
  "sm-fairview-pitx": 180,
  "one-ayala-ayala-solenad": 200,
  "pitx-bgc": 150,
};

// Booking state management
const bookingState = {
  route: null,
  date: null,
  passengersToReserve: 0,
  selectedSeats: [],
  totalPrice: 0,
  reset() {
    this.route = null;
    this.date = null;
    this.passengersToReserve = 0;
    this.selectedSeats = [];
    this.totalPrice = 0;
  },
};

// Load bus route data from localStorage on page load
function loadBusRouteData() {
  const storedData = localStorage.getItem("busRoutes");
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    Object.keys(busRoutes).forEach((route) => {
      busRoutes[route].availableSeatsByDate = {
        ...parsedData[route]?.availableSeatsByDate,
      };
      busRoutes[route].reservedSeatsByDate = {
        ...parsedData[route]?.reservedSeatsByDate,
      };

      // Ensure each date has the correct number of available seats
      Object.keys(busRoutes[route].reservedSeatsByDate).forEach((date) => {
        const reservedSeats = busRoutes[route].reservedSeatsByDate[date];
        busRoutes[route].availableSeatsByDate[date] =
          busRoutes[route].totalSeats - (reservedSeats || []).length;
      });
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
  const selectedDate = new Date(
    document.getElementById("departure-date").value
  );
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
  document.getElementById("save-reservation").style.display = seatsVisible
    ? "block"
    : "none";
}

// Modify toggleSeatSelection to prevent selecting more seats than available
function toggleSeatSelection(event) {
  const selectedSeat = event.target;
  const seatNumber = parseInt(selectedSeat.textContent);

  const selectedRoute = document.getElementById("bus-route").value;
  const selectedDate = new Date(
    document.getElementById("departure-date").value
  );
  const formattedDate = selectedDate.toISOString().slice(0, 10);
  const routeData = busRoutes[selectedRoute];
  const reservedSeats = routeData.reservedSeatsByDate[formattedDate];

  if (bookingState.selectedSeats.includes(seatNumber)) {
    // Deselect seat
    bookingState.selectedSeats = bookingState.selectedSeats.filter(
      (seat) => seat !== seatNumber
    );
    selectedSeat.classList.remove("selected");
    selectedSeat.classList.add("available");
  } else {
    // Check if we can select more seats
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
  const { route, date, selectedSeats, passengersToReserve, totalPrice } =
    bookingState;

  if (!route || !date || selectedSeats.length === 0) {
    alert("Please select seats before saving the reservation.");
    return;
  }

  if (selectedSeats.length !== passengersToReserve) {
    alert(
      `Please select exactly ${passengersToReserve} seat(s) for your reservation.`
    );
    return;
  }

  // Show payment modal
  const paymentModal = document.getElementById("payment-modal");
  const totalPriceSpan = document.getElementById("modal-total-price");
  totalPriceSpan.textContent = `₱${totalPrice.toFixed(2)}`;

  // Set minimum date for card expiry to current month
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    .toISOString()
    .split("T")[0];
  document.getElementById("card-expiry").min = minDate;

  // Set maximum date to 10 years from now
  const maxDate = new Date(today.getFullYear() + 10, today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  document.getElementById("card-expiry").max = maxDate;

  paymentModal.style.display = "block";
}

// Handle payment submission
function processPayment(event) {
  event.preventDefault();

  const cardNumber = document.getElementById("card-number").value;
  const cardExpiry = document.getElementById("card-expiry").value;
  const cardCVV = document.getElementById("card-cvv").value;

  if (!cardNumber || !cardExpiry || !cardCVV) {
    alert("Please fill in all payment details.");
    return;
  }

  // Validate card number
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    alert("Please enter a valid 16-digit card number.");
    return;
  }

  // Validate expiry date
  const expiryDate = new Date(cardExpiry);
  const today = new Date();

  if (expiryDate <= today) {
    alert("The card expiry date must be in the future.");
    return;
  }

  // Validate CVV
  if (cardCVV.length !== 3 || !/^\d+$/.test(cardCVV)) {
    alert("Please enter a valid 3-digit CVV.");
    return;
  }

  const { route, date, selectedSeats } = bookingState;
  const routeData = busRoutes[route];
  const reservedSeats = routeData.reservedSeatsByDate[date] || [];

  // Save reservation
  selectedSeats.forEach((seat) => {
    if (!reservedSeats.includes(seat)) {
      reservedSeats.push(seat);
    }
  });

  routeData.reservedSeatsByDate[date] = reservedSeats;
  routeData.availableSeatsByDate[date] =
    routeData.totalSeats - reservedSeats.length;

  // Save to localStorage
  saveBusRouteData();

  // Close modal and reset
  document.getElementById("payment-modal").style.display = "none";
  document.getElementById("payment-form").reset();
  bookingState.reset();
  updateAvailableSeats();

  alert("Payment successful! Your reservation has been confirmed.");
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("payment-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Handle ticket booking
function bookTickets() {
  const busRoute = document.getElementById("bus-route").value;
  const departureDate = new Date(
    document.getElementById("departure-date").value
  );
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
      const totalReservedSeats =
        routeData.reservedSeatsByDate[formattedDate].length;
      const currentAvailableSeats = routeData.totalSeats - totalReservedSeats;

      // New validation: Check if requested passengers exceed available seats
      if (passengers > currentAvailableSeats) {
        alert(
          `Sorry, you requested ${passengers} passengers, but only ${currentAvailableSeats} seat(s) are available for this route and date.`
        );
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

// Calculate and display total price
function updateTotalPrice() {
  const route = document.getElementById("bus-route").value;
  const passengers = parseInt(document.getElementById("passengers").value) || 0;
  const price = routePricing[route] * passengers;
  bookingState.totalPrice = price;

  // Update price display
  const priceDisplay = document.getElementById("total-price");
  if (priceDisplay) {
    priceDisplay.textContent = `Total Price: ₱${price.toFixed(2)}`;
  }
}

// Add event listeners
document
  .getElementById("bus-route")
  .addEventListener("change", updateAvailableSeats);
document
  .getElementById("departure-date")
  .addEventListener("change", updateAvailableSeats);
document
  .getElementById("save-reservation")
  .addEventListener("click", saveReservation);
document
  .getElementById("bus-route")
  .addEventListener("change", updateTotalPrice);
document
  .getElementById("passengers")
  .addEventListener("change", updateTotalPrice);
document
  .getElementById("payment-form")
  .addEventListener("submit", processPayment);

// Initialize data on page load
loadBusRouteData();
