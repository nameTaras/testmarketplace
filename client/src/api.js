import Config from "./config.js";

const Api = {
    getOptions: (method, contentType, body) => {
        const options = {
            method: method
        };
        contentType && (options.headers = { "Content-Type": contentType });
        body && (options.body = body);

        return options;
    },

    request: async function (endpoint, options) {
        const url = Config.hostWithApi + endpoint;

        let response = null;
        let responseData = null;
        try {
            response = await fetch(url, options);
            responseData = await response.clone().json();
        } catch (error) {
            console.log(error);
        }

        return { response, responseData };
    }
};

export default Api;