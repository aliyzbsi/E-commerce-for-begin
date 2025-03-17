### E-Commerce Web Application Documentation

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Components](#components)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Future Improvements](#future-improvements)

## 📝 Overview

This project is a full-featured e-commerce web application built with React. It provides a complete shopping experience including product browsing, searching, cart management, user authentication, order processing, and more. The application is responsive and supports both light and dark themes.

## ✨ Features

- **User Authentication**: Login and registration system
- **Product Catalog**: Browse products with filtering and sorting options
- **Product Details**: View detailed product information
- **Shopping Cart**: Add, remove, and update product quantities
- **Checkout Process**: Multi-step checkout with address and payment information
- **Order History**: View past orders and their details
- **User Profile**: Manage personal information, addresses, and payment methods
- **Favorites/Wishlist**: Save products for later
- **Search Functionality**: Find products by keywords
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Theme Switching**: Toggle between light and dark modes
- **Notifications**: System notifications for user actions

## 🛠️ Technologies Used

- **Frontend Framework**: React.js
- **Routing**: React Router v6
- **State Management**: React Context API, React Query
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify
- **Icons**: React Icons, Lucide React
- **Data Fetching**: TanStack Query (React Query)
- **API**: DummyJSON API

## 📂 Project Structure

```plaintext
src/
├── components/         # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── utils/              # Utility functions
└── App.jsx             # Main application component
```

## 🚀 Installation

1. Clone the repository:

```shellscript
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

2. Install dependencies:

```shellscript
npm install
```

3. Start the development server:

```shellscript
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 💻 Usage

### User Authentication

The application uses a simple authentication system with localStorage for persistence. Users can register and log in to access protected features like the shopping cart and checkout process.

```javascript
// Login example
const handleLogin = (email, password) => {
  // In a real application, this would make an API call
  setLoggedUser(email);
  localStorage.setItem("loggedUser", email);
  navigate(from || "/");
};
```

### Shopping Cart

The cart functionality allows users to add products, adjust quantities, and remove items. Cart data is persisted in localStorage.

```javascript
// Add to cart example
const addToCart = (product) => {
  if (!loggedUser) {
    navigate("/login", { state: { from: location.pathname } });
    return;
  }

  const existingItem = sepet.find((item) => item.id === product.id);

  if (existingItem) {
    const updatedCart = sepet.map((item) =>
      item.id === product.id ? { ...item, adet: item.adet + 1 } : item
    );
    setSepet(updatedCart);
    localStorage.setItem("sepet", JSON.stringify(updatedCart));
  } else {
    const updatedCart = [...sepet, { ...product, adet: 1 }];
    setSepet(updatedCart);
    localStorage.setItem("sepet", JSON.stringify(updatedCart));
  }
};
```

### Theme Switching

The application supports light and dark themes using Tailwind CSS and React Context.

```javascript
// Theme toggle example
const toggleTheme = () => {
  setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
};
```

## 🔌 API Integration

The application uses the DummyJSON API for product data. API calls are made using Axios and managed with React Query for caching and state management.

```javascript
// API service example
export const getProduct = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products?limit=200`);
    return response.data.products;
  } catch (error) {
    console.error("Ürünler getirilirken hata oluştu:", error);
    throw new Error(
      "Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    );
  }
};
```

## 🧩 Components

### Core Components

- **Header**: Navigation, search, cart, and user menu
- **Footer**: Site information and links
- **Products**: Product grid display with filtering and sorting
- **ProductDetail**: Detailed product view with related products
- **Sepet (Cart)**: Shopping cart management
- **SepetSidebar**: Cart summary and checkout options
- **Adres (Address)**: Address form and selection
- **Odeme (Payment)**: Payment information form
- **SuccessOrder**: Order confirmation page
- **UserProfile**: User account management
- **NotFound**: 404 page
- **ErrorBoundary**: Error handling component

### Utility Components

- **LoadingSpinner**: Loading indicator
- **FavoriteButton**: Add/remove from favorites
- **ThemeToggleButton**: Switch between light and dark themes
- **SearchBar**: Product search functionality

## 📊 State Management

The application uses React Context API for global state management:

- **ThemeContext**: Manages the application theme
- **FavoritesContext**: Manages user's favorite products

Local state is managed with React's useState hook, and localStorage is used for persistence across sessions.

Custom hooks like `useLocalStorage` are used to simplify state management with localStorage.

## 🧭 Routing

React Router v6 is used for navigation with protected routes for authenticated users.

```javascript
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Home />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/login" element={<Login />} />

  {/* Protected routes */}
  <Route
    path="/sepet"
    element={
      loggedUser ? (
        <Sepet />
      ) : (
        <Navigate to="/login" state={{ from: "/sepet" }} replace />
      )
    }
  />
  {/* Other protected routes */}

  {/* 404 route */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## 🎨 Styling

The application uses Tailwind CSS for styling with a responsive design approach. Dark mode is supported through Tailwind's dark mode feature and a custom theme context.

```javascript
// Example of conditional styling with Tailwind and theme
<div
  className={`
  rounded-lg shadow-md overflow-hidden
  ${theme === "light" ? "bg-white" : "bg-gray-800"}
`}
>
  {/* Component content */}
</div>
```

## 🚀 Future Improvements

- Implement a backend server with a real database
- Add user registration with email verification
- Integrate a payment gateway for real transactions
- Implement product reviews and ratings
- Add admin dashboard for product and order management
- Implement internationalization (i18n) for multiple languages
- Add unit and integration tests
- Implement PWA features for offline access
- Add product comparison feature
- Implement social login options
