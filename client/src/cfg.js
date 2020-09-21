const Config = {
    env: (env) => {
        return {
            hostWithApi: (function () {
                if (env === "dev") {
                    return "http://localhost:3001/api";
                } else {
                    return "https://testmarketplace.herokuapp.com/api";
                }
            })(),
            host: (function () {
                if (env === "dev") {
                    return "http://localhost:3001";
                } else {
                    return "https://testmarketplace.herokuapp.com";
                }
            })()
        }
    }
};

export default Config;