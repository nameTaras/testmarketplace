const Config = {
    hostWithApi: process.env.NODE_ENV === "production" ? 
        "https://testmarketplace.herokuapp.com/api" : "http://localhost:3001/api",
    host: process.env.NODE_ENV === "production" ? 
        "https://testmarketplace.herokuapp.com" : "http://localhost:3001"
};

export default Config;