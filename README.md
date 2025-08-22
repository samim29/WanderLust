# Wanderlust - Property Listing Web Application

Wanderlust is a full-stack property listing platform inspired by Airbnb. Users can browse, search, filter, and manage property listings, upload images, leave reviews, and authenticate securely. The project follows the MVC (Model-View-Controller) architecture for clean separation of concerns.

## Features

- **User Authentication:** Sign up, log in, and session management.
- **Property Listings:** Create, edit, delete, and view listings with image uploads (Cloudinary).
- **Category Filtering:** Filter listings by category (e.g., Trending, Mountains, Farms, etc.).
- **Search Functionality:** Search listings by title, location, country, or category.
- **Reviews:** Add and manage reviews for listings.
- **Responsive UI:** Modern, mobile-friendly design using EJS templates.
- **Flash Messages:** User feedback for actions and errors.
- **MVC Structure:** Organized codebase for scalability and maintainability.

## Technologies Used

- Node.js
- Express.js
- MongoDB & Mongoose
- Passport.js (Authentication)
- EJS (Templating)
- Cloudinary (Image Uploads)
- Bootstrap (UI Styling)
- dotenv (Environment Variables)

## Project Structure

```
major-project/
├── controllers/      # Route handlers (business logic)
├── models/           # Mongoose schemas and models
├── routes/           # Express route definitions
├── views/            # EJS templates for UI
├── public/           # Static assets (CSS, JS, images)
├── utils/            # Utility classes (e.g., error handling)
├── init/             # Database seeding scripts
├── app.js            # Main application entry point
├── .env              # Environment variables
```

## Getting Started

1. **Clone the repository:**
   ```
   git clone https://github.com/samim29/WanderLust.git
   cd wanderlust
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add your MongoDB URI, Cloudinary credentials, and session secret:
     ```
     ATLASDB_URL=your_mongodb_uri
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     SECRET=your_session_secret
     ```

4. **Seed the database (optional):**
   ```
   node init/index.js
   ```

5. **Run the application:**
   ```
   npm start
   ```
   or
   ```
   nodemon app.js
   ```

6. **Visit in your browser:**
   ```
   http://localhost:8080/
   ```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

---

**Enjoy exploring and managing properties with Wanderlust!**
