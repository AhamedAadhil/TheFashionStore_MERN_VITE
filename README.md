TheFashionStore_MERN_VITEOverviewTheFashionStore is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) with Vite as the frontend build tool. It serves as an e-commerce platform for a fashion store, allowing users to browse, search, and purchase fashion products.FeaturesUser Authentication (Register, Login, Logout)Product Browsing and SearchingShopping CartOrder ManagementAdmin Panel for Product and Order ManagementTechnologiesFrontend: React, Vite, Tailwind CSSBackend: Node.js, Express.jsDatabase: MongoDBState Management: ReduxInstallationClone the repository:git clone https://github.com/AhamedAadhil/TheFashionStore_MERN_VITE.git
cd TheFashionStore_MERN_VITEInstall dependencies for both client and server:cd client
npm install
cd ../server
npm installSet up environment variables:Create a .env file in the server directory and add the necessary variables:MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secretRun the development server:cd server
npm run devRun the frontend:cd client
npm run devUsageVisit http://localhost:3000 to view the frontend.The backend will run on http://localhost:5000.
