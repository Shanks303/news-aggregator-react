# React-News-App - [[Netlify Link](https://vite-react-news-app.netlify.app/)]

### Overview

This project is a news aggregator website built with React.js. The application pulls articles from various sources and displays them in a clean, easy-to-read format. Users can search for articles by keyword, filter results by date, category, and source, and create a personalized news feed. The application is mobile-responsive and optimized for viewing on various devices.

### Features

1. Article Search and Filtering:
Users can search for articles by entering keywords.
Filtering options are available by date, category, and source.
2. Personalized News Feed:
Users can customize their news feed by selecting preferred sources, categories, and authors.
3. Mobile-Responsive Design:
The website is optimized for both desktop and mobile devices.
4. Data Sources:
The application uses the following data sources:
NewsAPI , The Guardian API, New York Times API 

### Technologies Used
- Vite: a JavaScript build tool for faster and more efficient way to create react app.
- React.js: A JavaScript library for building user interfaces.
- Redux Toolkit: For state management.
- Axios: For making HTTP requests to fetch data from APIs.
- React Bootstrap: For UI components and styling.
- Docker: For containerizing the application.


### Implementation Details
1. Search and Filtering
- SearchBar Component: Allows users to search articles by entering keywords. This triggers a search request to the selected data sources.
- FilterOptions Component: Users can filter articles based on categories, date ranges, and sources. This component interacts with Redux to update the filter criteria.

2. Personalized News Feed
- PersonalizedFeed Component: Displays a custom news feed based on user preferences such as preferred categories, sources, and authors. User preferences are stored in Redux and used to fetch and display relevant articles.

3. Mobile-Responsive Design
- Responsive Layout: The UI components are designed using React Bootstrap, ensuring the layout adjusts for different screen sizes. Media queries are used for custom styling on mobile devices.

4. API Integration
- api.js contains four different data sources newsAPI, guardianAPI, nytAPI: These service file handle API requests to the respective data sources. It contains functions to fetch data, and convert all the data into normalize data which are used in Redux actions and components.

5. State Management
- Redux Toolkit: Used to manage the state of the application, including articles fetched, user preferences, and filter criteria. Redux slices (articlesSlice.jsx) are created to handle specific aspects of the state.

## Dockerization
### Dockerfile

The Dockerfile defines the steps to build the Docker image for the application.

### Use an official Node.js runtime as a parent image
`FROM node:22-alpine`

### Set the working directory in the container
`WORKDIR /app`

### Copy package.json and package-lock.json files
`COPY package*.json .`

### Install the dependencies
`RUN npm install`

### Copy the rest of the application files
`COPY . .`

### Expose port 5173 to access the app
`EXPOSE 5173`

### Start npm server
`CMD ["npm", "run", "dev"]`

## Build and Run the Docker Container

1. Build the Docker Image: Open a terminal in the root directory of your project and run:

	`docker build -t react-news-app .` . 

3. Run the Docker Container: To start a container from your image, run:
	
 	`docker run --rm -p 5173:5173 react-news-app`

4. Access the Application:

	Open your web browser and go to http://localhost/5173: to see the application running.

5. Stopping the Container:

	If you started the container directly, find the container ID with:
	
	`docker ps`

	Then stop it with:

	`docker stop <container_id>`
