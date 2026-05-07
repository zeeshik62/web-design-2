# HMS-SD | Hall Management System

![Project Banner](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

**HMS-SD** is a comprehensive, full-stack Hall Management System designed to bridge the gap between hall owners and customers. It features a robust vendor discovery platform, detailed hall management, and an intuitive customer inquiry system.

## 🌟 Key Features

### 🏢 For Hall Owners
- **Advanced Dashboard**: Manage multiple halls and sub-halls from a unified interface.
- **Vendor Management**: List and manage associated vendors (Caterers, Decorators, etc.) with UK-specific categories.
- **Inquiry Tracking**: Real-time management of customer inquiries and booking requests.
- **Dynamic Pricing**: Set seasonal discounts and custom menu packages.
- **Secure Authentication**: JWT-based role management with secure password recovery via Nodemailer.

### 🔍 For Customers
- **Public Discovery**: Search and filter halls by location, name, price range, and discounts.
- **Rich Media**: High-quality image galleries for every venue (powered by Multer).
- **Instant Inquiries**: Directly contact hall owners through integrated forms.
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom Design System)
- **API Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JSON Web Tokens (JWT) & BcryptJS
- **File Handling**: Multer
- **Emailing**: Nodemailer
- **Templates**: Pug (Email/Static Views)

---

## 📂 Project Structure

```bash
hms-sd/
├── frontend/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/      # Reusable UI Components
│   │   ├── layouts/         # Role-specific layouts (Owner/Customer)
│   │   ├── pages/           # Application views
│   │   ├── services/        # API integration layers
│   │   └── utils/           # Helper functions & constants
├── src/                     # Node.js Backend
│   ├── config/              # DB and Environment configs
│   ├── controllers/         # Business logic
│   ├── middlewares/         # Auth, Error handling, Validation
│   ├── models/              # Mongoose Schemas
│   ├── routes/              # API Endpoints
│   └── services/            # Database operations
├── public/                  # Static assets & Uploads
├── .env                     # Environment variables
└── docker-compose.yml       # Docker orchestration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- NPM or Yarn

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd hms-sd
   ```

2. **Backend Setup**
   ```bash
   # Install dependencies
   npm install

   # Configure environment variables
   # Create a .env file based on the section below
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

---

## 🎨 Aesthetics & Design
The system employs a premium **Dark Mode** aesthetic (accessible via `OwnerLayout.css`) with:
- Glassmorphism effects.
- Dynamic hover states and micro-animations.
- High-contrast typography using modern sans-serif fonts.
- Responsive grid layouts for hall discovery.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Developed for the Roehampton Web Design 2 Module.**