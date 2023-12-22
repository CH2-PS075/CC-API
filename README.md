# CC API (Backend Server)

## Introduction

This project is built using Express.js, a fast, unopinionated, minimalist web framework for Node.js.

## Getting Started

### Prerequisites

- NodeJS

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/wildanlh/CC-API.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CC-API
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a **.env** file in the project root `CC-API/.env`.
2. Add the following configurations to the .env file, modifying them according to your environment:

   ```bash
   PORT=8080
   USERNAME_DATABASE=yourdatabaseusername
   PASSWORD_DATABASE=yourdatabasepassword
   DATABASE_NAME=yourdatabasename
   DATABASE_HOST=localhost or yourhostdatabase
   ACCESS_TOKEN_SECRET=yourtoken
   PROJECT_ID_GCP=yourprojectid
   BUCKET_NAME=yourbucketname
   FACEVALIDATE_URL=https://example.com
   CHATBOT_URL=https://example.com
   RECOMMEND_URL=https://example.com
   ```

3. Add your **credentials.json** or key of Service Account from your Google Cloud Platform in the project root `CC-API/credentials.json`

### Usage

- Run project in development mode.

```bash
  npm run dev
```

- Run project in production mode.

```bash
  npm run start
```
