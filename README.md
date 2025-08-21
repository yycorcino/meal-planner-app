<a name="readme-top"></a>

<div align="center">
  <h3 align="center">Meal Planner</h3>

  <p align="center">
    Developed By: Sebastian Corcino, Jared Keeler, Massimo Nikolic, Renz Pascual, Malachi Retherford
  </p>
</div>

<!-- ABOUT THE PROJECT -->

<div class="photo-row">
  <img src="./readme_assets/IMG_3005.png" alt="IMG_3005" />
  <img src="./readme_assets/IMG_3006.png" alt="IMG_3006" />
  <img src="./readme_assets/IMG_3007.png" alt="IMG_3007" />
  <img src="./readme_assets/IMG_3008.png" alt="IMG_3008" />
  <img src="./readme_assets/IMG_3009.png" alt="IMG_3009" />
  <img src="./readme_assets/IMG_3010.png" alt="IMG_3010" />
  <img src="./readme_assets/IMG_3011.png" alt="IMG_3011" />
</div>

<style>
  .photo-row {
    display: flex;
    gap: 8px;
    overflow-x: auto;      /* scrolls on small screens */
    padding: 6px 0;
    justify-content: center; /* centers when content fits */
  }
  .photo-row img {
    height: 120px;
    flex: 0 0 auto;         /* prevents wrapping */
    border-radius: 8px;
  }
</style>

### About The Project

This is the system requirements for the Meal Planner App version 1.0. This version of the meal planner is a simplified shell of its final product but creates a fundamental and functional base that features can be added to over time. The goals for this version are to streamline the process of making a shopping list. Specifically for the purpose of convenience and to ease pressure on the user financially by preparing them with a precise shopping list of only what they need. We will accomplish this in version 1.0 with three main goals.

- Have a collection of specific meals for the user
- The ability to apply meals to a specific day on a calendar
- The ability to convert a range of dates to a shopping list

The collection of meals reflects the natural rotation of familiar meals the user finds themselves eating most days. The connection between meals and a specific day supports the concept of buying what you need and to collect information for the biggest feature; the generation of a shopping list which the user can use as they shop and prior to shopping to confirm what ingredients they already have access to at home. Other smaller features will be included in version 1.0; they mostly exist to support these three concepts.

### Steps

How to get project running.

1. Download all the Node Packages

```
npm install
```

2. Start Expo Project

```
npx expo start
```

3A. Open on Android Simulator

```
(Enter a)
```

_Prerequisite: Have Andriod Studio Running._

3B. Open on Expo Go (Mobile App)

```
(Scan QR code from phone camera app)
```

_Prerequisites: Have Expo Go installed and be on the same wifi network on both devices._
