# Hall Platform API

## Overview
The Hall Platform API is a Node.js application designed to manage hall bookings, enquiries, discounts, and menu packages. It provides a RESTful interface for clients to interact with the system.

## Features
- User authentication and authorization
- Hall management (create, retrieve, update, delete)
- Enquiry submission and retrieval
- Discount management
- Menu package management

## Project Structure
```
hall-platform-api
├── src
│   ├── app.js
│   ├── config
│   │   ├── constants.js
│   │   ├── db.js
│   │   └── env.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── discount.controller.js
│   │   ├── enquiry.controller.js
│   │   ├── hall.controller.js
│   │   └── menu.controller.js
│   ├── middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   ├── models
│   │   ├── Discount.model.js
│   │   ├── Enquiry.model.js
│   │   ├── Hall.model.js
│   │   ├── MenuPackage.model.js
│   │   └── User.model.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── discount.routes.js
│   │   ├── enquiry.routes.js
│   │   ├── hall.routes.js
│   │   └── menu.routes.js
│   ├── services
│   │   ├── auth.service.js
│   │   ├── discount.service.js
│   │   ├── enquiry.service.js
│   │   ├── hall.service.js
│   │   └── menu.service.js
│   ├── types
│   │   └── index.js
│   ├── utils
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── token.js
│   └── validators
│       ├── auth.validator.js
│       ├── discount.validator.js
│       ├── enquiry.validator.js
│       └── hall.validator.js
├── .env
├── .gitignore
└── package.json
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd hall-platform-api
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Set up your environment variables in the `.env` file.
2. Start the server:
   ```
   npm start
   ```

## API Documentation
Refer to the individual controller files for detailed API endpoints and usage.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.