// script.js

// Bus route details with available seats
const busRoutes = {
    "sm-fairview-pitx": {
      totalSeats: 5,
      availableSeatsByDate: {}
    },
    "one-ayala-ayala-solenad": {
      totalSeats: 5,
      availableSeatsByDate: {}
    },
    "pitx-bgc": {
      totalSeats: 5,
      availableSeatsByDate: {}
    }
  };
  
  // Load bus route data from localStorage on page load
  function loadBusRouteData() {
    const storedData = localStorage.getItem("busRoutes");
    if (storedData) {
      busRoutes = JSON.parse(storedData);
    } else {
      // Initialize available seats for each route on a per-day basis
      for (const route in busRoutes) {
        busRoutes[route].availableSeatsByDate = {
          [new Date().toISOString().slice(0, 10)]: busRoutes[route].totalSeats
        };
      }
    }
    updateAvailableSeats();
  }
  
  // Save bus route data to localStorage on any change
  function saveBusRouteData() {
    localStorage.setItem("busRoutes", JSON.stringify(busRoutes));
  }
  
  // Update the available seats and save the data
  function updateAvailableSeats() {
    const seatGrid = document.getElementById("seat-grid");
    seatGrid.innerHTML = "";
  
    const selectedRoute = document.getElementById("bus-route").value;
    const selectedDate = new Date(document.getElementById("departure-date").value);
    const routeData = busRoutes[selectedRoute];
    const totalSeats = routeData.totalSeats;
  
    // Check if there are any reservations for the selected date
    const availableSeats = routeData.availableSeatsByDate[selectedDate.toISOString().slice(0, 10)] || routeData.totalSeats;
  
    for (let i = 1; i <= totalSeats; i++) {
      const seatElement = document.createElement("div");
      seatElement.classList.add("seat");
      if (i <= availableSeats) {
        seatElement.classList.add("available");
        seatElement.textContent = i;
        seatElement.addEventListener("click", reserveSeat);
      } else {
        seatElement.textContent = i;
        seatElement.classList.remove("available");
      }
      seatGrid.appendChild(seatElement);
    }
  
    saveBusRouteData();
  }
  
  // Flag to track if the form has been submitted
  let isFormSubmitted = false;
  
  // Function to handle seat reservation
  function reserveSeat(event) {
    const selectedSeat = event.target;
    const selectedRoute = document.getElementById("bus-route").value;
    const selectedDate = new Date(document.getElementById("departure-date").value);
    const passengers = parseInt(document.getElementById("passengers").value);
  
    if (isFormSubmitted) {
      if (selectedSeat.classList.contains("available")) {
        const routeData = busRoutes[selectedRoute];
        const availableSeats = routeData.availableSeatsByDate[selectedDate.toISOString().slice(0, 10)];
        if (availableSeats > 0) {
          selectedSeat.classList.remove("available");
          routeData.availableSeatsByDate[selectedDate.toISOString().slice(0, 10)]--;
          alert(`Seat ${selectedSeat.textContent} has been reserved.`);
          saveBusRouteData();
        } else {
          alert("Sorry, there are no more available seats for this date.");
        }
      } else {
        alert("This seat is already reserved.");
      }
    } else {
      alert("Please submit the form first before reserving seats.");
    }
  }
  
  // Function to handle ticket booking
  function bookTickets() {
    const busRoute = document.getElementById("bus-route").value;
    const departureDate = new Date(document.getElementById("departure-date").value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set current date to 00:00:00
  
    // Check if the selected departure date is in the present or future
    if (departureDate >= currentDate) {
      const passengers = parseInt(document.getElementById("passengers").value);
  
      if (busRoute && passengers) {
        const routeData = busRoutes[busRoute];
        const availableSeats = routeData.availableSeatsByDate[departureDate.toISOString().slice(0, 10)] || routeData.totalSeats;
        if (passengers <= availableSeats) {
          routeData.availableSeatsByDate[departureDate.toISOString().slice(0, 10)] -= passengers;
          alert(`You have booked ${passengers} tickets for the ${busRoute} route on ${departureDate.toLocaleDateString()}.`);
          isFormSubmitted = true;
          updateAvailableSeats();
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
  
  // Add event listeners to update the seat grid on input changes
  document.getElementById("bus-route").addEventListener("change", updateAvailableSeats);
  document.getElementById("departure-date").addEventListener("change", updateAvailableSeats);
  
  // Load the bus route data on page load
  loadBusRouteData();