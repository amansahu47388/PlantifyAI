# PlantifyAI - Plant Disease Detection and Management System

PlantifyAI is a comprehensive plant disease detection and management system that combines the power of artificial intelligence with mobile and web technologies to help farmers and gardeners identify and manage plant diseases effectively.

## Project Components

### 1. Backend (Django REST API)
- Built with Django and Django REST Framework
- Handles user authentication and management
- Processes plant disease detection using AI models
- Manages user profiles and disease detection history
- Located in `/Backend` directory

### 2. Frontend (React + Vite)
- Modern web interface built with React and Vite
- Responsive design for all devices
- Interactive disease detection interface
- User dashboard for history and management
- Located in `/frontend` directory


## Features

- 🌿 Real-time plant disease detection
- 👤 User authentication and profile management
- 📱 Cross-platform support (Web & Mobile)
- 📊 History tracking and analysis
- 📫 Contact support system

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.10 or higher)
- pip (Python package manager)
- npm (Node package manager)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Create and activate virtual environment:
   ```bash
   python -m venv env
   .\env\Scripts\activate  # Windows
   source env/bin/activate # Linux/Mac
   ```
3. Install dependencies:
   ```bash
   cd Plantify
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


## Technologies Used

### Backend
- Django
- Django REST Framework
- TensorFlow/PyTorch (AI Model)
- SQLite/PostgreSQL

### Frontend
- React
- Vite
- Axios
- React Router


## Project Structure
```
PlantifyAI/
├── Backend/               # Django backend
├── frontend/             # React web frontend
└── App/                  # React Native mobile app
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact us through the application's contact form or create an issue in the repository.

## Acknowledgments

- Plant disease dataset providers
- Open source community
- All contributors to this project