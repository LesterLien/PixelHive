# PixelHive

PixelHive is a personal project — a web application built for PC gamers to explore, track, and find deals on their favorite games. It uses real-time data from APIs to show trending titles, store discounts, and pricing information.

---

## Features

- Browse trending, popular, collected, and waitlisted PC games
- View regular and discounted prices across multiple game stores
- View a deals page by stores and total games on sale
- Register/login and favorite games
- Secure authentication using JWT & bcrypt
- Clean user interface and experience

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)  

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

### Database
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

### APIs 
- [Steam Web API](https://steamapi.xpaw.me/#)  
- [IsThereAnyDeal (ITAD) API](https://docs.isthereanydeal.com/)

### Authentication
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Bcrypt](https://img.shields.io/badge/Bcrypt-green?style=for-the-badge&logo=bcrypt)

---

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/LesterLien/PixelHive.git
2. **Navigate into the project folder**
   ```bash
   cd PixelHive
3. **Install dependencies**
   ```bash
   npm install
4. **Set up .env file**  
   Create a .env file in the project directory and add your own keys with:
   ```bash
   # API Keys
   REACT_APP_ITAD_API_KEY=personal_itad_api_key
   REACT_APP_STEAM_API_KEY=personal_steam_api_key
   # JWT Tokens
   JWT_ACCESS_TOKEN=personal_jwt_access_token
   JWT_REFRESH_ACCESS_TOKEN=personal_jwt_refresh_token
5. **Run the project**
   ```bash
   npm run start:backend
   npm run start:frontend

# By Lester Lien
---
   

