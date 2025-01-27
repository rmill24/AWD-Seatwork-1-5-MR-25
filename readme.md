<a name="readme-top">

<br/>

<br />
<div align="center">
  <a href="https://github.com/zyx-0314/">
    <img src="./assets/img/nyebe_white.png" alt="Nyebe" width="130" height="100">
  </a>
  <h3 align="center">Apollo Transport Hub</h3>
</div>
<div align="center">
 A website that manages seating reservations of 3 buses with 5 seats each.
</div>

<br />
![](https://visit-counter.vercel.app/counter.png?page=rmill24/AWD-Seatwork-1-5-MR-25)

[![wakatime](https://wakatime.com/badge/user/6c80cdc4-dec4-4068-bf60-95dc0fb14311.svg)](https://wakatime.com/@6c80cdc4-dec4-4068-bf60-95dc0fb14311)

---

<br />
<br />

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#overview">Overview</a>
      <ol>
        <li>
          <a href="#key-components">Key Components</a>
        </li>
        <li>
          <a href="#technology">Technology</a>
        </li>
      </ol>
    </li>
    <li>
      <a href="#rule,-practices-and-principles">Rules, Practices and Principles</a>
    </li>
    <li>
      <a href="#resources">Resources</a>
    </li>
  </ol>
</details>

---

## Overview
This project is a single page website consisting of a landing page and a form that allows a client to book a seat for 3 different bus routes.

Usage:
To use the booking system, simply select a bus route and departure date from the form to show available seats. To book seats, input the number of passengers you will be booking for and click on the "Book Now" button. Afterwards, you will be able to select available seats based on the number of passengers you are booking for. After selecting your seats, you may now save your reservation.

The form will alert for things such as:
- Incomplete fields
- Trying to book for more than the available seats
- Saving reservation when:
  a. You have not matched the number of seats selected to the number of passengers you booked for
  b. You have not selected any seat/s
- Booking for a past date
- There are no seats left for the chosen route and date

### Key Components
- Single Page Website
- Parallax transition
- Transactional

### Technology
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white)

## Rules, Practices and Principles
1. Always use `WD-` in the front of the Title of the Project for the Subject followed by your custom naming.
2. Do not rename any .html files; always use `index.html` as the filename.
3. Place Files in their respective folders.
4. All file naming are in camel case.
   - Camel case is naming format where there is no white space in separation of each words, the first word is in all lower case while the succeding words first letter are in upper followed by lower cased letters.
   - ex.: buttonAnimatedStyle.css
5. Use only `External CSS`.
6. Renaming of Pages folder names are a must, and relates to what it is doing or data it holding.
7. File Structure to follow below.

```
WD-ProjectName
└─ assets
|   └─ css
|   |   └─ style.css
|   └─ img
|   |   └─ fileWith.jpeg/.jpg/.webp/.png
|   └─ js
|       └─ script.js
└─ pages
|  └─ pageName
|     └─ assets
|     |  └─ css
|     |  |  └─ style.css
|     |  └─ img
|     |  |  └─ fileWith.jpeg/.jpg/.webp/.png
|     |  └─ js
|     |     └─ script.js
|     └─ index.html
└─ index.html
└─ readme.md
```

## Resources
| Title | Purpose | Link |
|-|-|-|
| Parallax Scrolling | Tutorial on how to add parallax animation using HTML, CSS, and JavaScript | https://www.youtube.com/watch?v=kmM6mqvnxcs&t=622s |
