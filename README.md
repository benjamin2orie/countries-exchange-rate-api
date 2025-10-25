

# 🌍 Country Data API

This is a Node.js + TypeScript backend API that fetches country and currency data from external sources, stores it in a MySQL database using Sequelize ORM, and generates a summary image of the top 5 countries by estimated GDP.



## 🚀 Features

- Fetches and stores country data with exchange rates
- Calculates estimated GDP using population and exchange rate
- Generates a summary image with:
  - Total number of countries
  - Top 5 countries by estimated GDP
  - Timestamp of last refresh
- Serves the summary image via a public endpoint
- Validates incoming data and handles errors gracefully



## 🧰 Tech Stack & Dependencies

| Package | Purpose |
|--------|---------|
| **express** | Web framework for building REST APIs |
| **sequelize** | ORM for MySQL database interaction |
| **mysql2** | MySQL driver for Sequelize |
| **typescript** | Type-safe JavaScript |
| **sharp** | Image processing and generation |
| **dotenv** | Loads environment variables from `.env` file |
| **axios** | HTTP client for fetching external APIs |
| **nodemon** | Auto-restarts server during development |
| **ts-node-dev** | TypeScript execution with hot-reloading |
| **cors** | Enables CORS for cross-origin requests |



## 📦 Installation

1. **Clone the repository**
bash
git clone https://github.com/your-username/country-data-api.git
cd country-data-api

## run this command to install all the dependencies
npm install

# .env contents

    PORT=5000
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_database_name
    EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest/USD
    COUNTRIES_API_URL=https://restcountries.com/v2/all


## finally run this command to start your dev server:
 npm run dev

## then visit: http://localhost:5000/countries 






