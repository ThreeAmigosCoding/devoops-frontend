# devoops-frontend

Angular frontend for the DevOops accommodation booking system.

## Prerequisites
- Node.js 20+
- npm 10+
- Angular CLI 19

## Development

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm start
```

The app runs on http://localhost:4200 with API calls proxied to http://localhost:8080.

## Build

Development build:
```bash
npm run build
```

Production build:
```bash
npm run build:prod
```

## Docker

Build Docker image:
```bash
docker build -t devoops-frontend .
```

Run Docker container:
```bash
docker run -p 4200:80 devoops-frontend
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
