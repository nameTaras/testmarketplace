const ProductFactory = require("../factory/productFactory.js");

module.exports = function (router) {
    router.get("/api/getProducts", ProductFactory.getProducts);

    router.post("/api/addProduct", ProductFactory.addProduct);

    router.get("/api/getProduct", ProductFactory.getProduct);

    router.put("/api/likeProduct", ProductFactory.likeProduct);

    router.put("/api/unlikeProduct", ProductFactory.unlikeProduct);

    router.get("/api/getLikedProducts", ProductFactory.getLikedProducts);
}