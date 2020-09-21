const mongoose = require("mongoose");
const multiparty = require('multiparty');
const ObjectId = require("mongodb").ObjectID;
const GoogleDriveApi = require("../googleDriveApi/api.js");
const Config = require("../../config/config.server.js");
const { refreshToken } = require('../googleDriveApi/authorizeApp.js');

const productsSchema = require("../validation/productValidation.js");

async function getProducts(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const appCollection = db.collection("app");
    const productsCollection = db.collection("products");
    const filter = req.query;

    const query = {};
    if (filter.title) {
        query.title = { $regex: filter.title, $options: 'i' };
    }
    if (filter.location) {
        query.location = filter.location;
    }
    if (filter.ownerId) {
        query.ownerId = filter.ownerId;
    }

    let cursor = null;
    try {
        cursor = await productsCollection.find(query);
    } catch (err) {
        console.log(err);
    }

    let products = null;
    try {
        products = await cursor.toArray();
    } catch (err) {
        console.log(err);
    }

    for (let product of products) {
        if (product.photos) {
            refreshToken(appCollection);
            try {
                const response = await GoogleDriveApi.getFile(product.photos);
                product.photos = response.data;
            } catch (err) {
                console.log(err);
            }
        }
    }

    res.send(products);
}

async function addProduct(req, res) {
    const AddProduct = mongoose.model("AddProduct", productsSchema.addProductSchema);
    const db = req.mongo.db("marketplaceApp");
    const productsCollection = db.collection("products");
    const appCollection = db.collection("app");
    const form = new multiparty.Form();
    let product = null;

    let app = null;
    try {
        app = await appCollection.findOne({});
    } catch (err) {
        console.log(err);
    }

    try {
        product = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                }
                resolve({ ...fields, ...files });
            })
        });
    } catch (err) {
        console.log(err);
    }

    for (let key in product) {
        product[key] = product[key][0];
    }

    product = { ...product, ownerId: req.user._id.toString() };
    !product.description && (delete product.description);
    !product.price && (delete product.price);

    if (product.photos && product.photos.length > 0) {
        refreshToken(appCollection);
        try {
            const productsPhoto = 
                Config.environment === "development"? "testProductsPhoto" : "productsPhoto";
            const response = await GoogleDriveApi.uploadFile(
                product.title,
                [app.googleDriveFolders[productsPhoto]],
                product.photos
            );
            product.photos = response.data.id;
        } catch (err) {
            console.log(err);
        }
    } else {
        delete product.photos;
    }

    try {
        const insertResult = await productsCollection.insertOne(new AddProduct(product));
        res.send({ ...product, _id: insertResult.insertedId });
    } catch (err) {
        console.log(err);
    }
}

async function getProduct(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const appCollection = db.collection("app");
    const productsCollection = db.collection("products");
    const productId = req.query.id;

    let product = null;
    try {
        product = await productsCollection.findOne({ "_id": ObjectId(productId) });
    } catch (err) {
        console.log(err);
    }

    if (product.photos) {
        refreshToken(appCollection);
        try {
            const response = await GoogleDriveApi.getFile(product.photos);
            product.photos = response.data;
        } catch (err) {
            console.log(err);
        }
    };

    res.send(product);
}

async function likeProduct(req, res) {
    const LikeProduct = mongoose.model("LikeProduct", productsSchema.likeProductSchema);
    const db = req.mongo.db("marketplaceApp");
    const likedCollection = db.collection("liked");
    const { productId } = new LikeProduct(req.body);
    const userId = req.user._id.toString();

    try {
        const updatedItem = await likedCollection.findOneAndUpdate(
            { userId },
            { $push: { products: ObjectId(productId) } },
            { returnOriginal: false }
        );

        res.send(updatedItem.value);
    } catch (err) {
        console.log(err);
    }
}

async function unlikeProduct(req, res) {
    const UnlikeProduct = mongoose.model("UnlikeProduct", productsSchema.unlikeProductSchema);
    const db = req.mongo.db("marketplaceApp");
    const likedCollection = db.collection("liked");
    const { productId } = new UnlikeProduct(req.body);
    const userId = req.user._id.toString();

    try {
        const updatedItem = await likedCollection.findOneAndUpdate(
            { userId },
            { $pull: { products: { $in: [ObjectId(productId)] } } },
            { returnOriginal: false }
        );

        res.send(updatedItem.value);
    } catch (err) {
        console.log(err);
    }
}

async function getLikedProducts(req, res) {
    const db = req.mongo.db("marketplaceApp");
    const appCollection = db.collection("app");
    const likedCollection = db.collection("liked");
    const userId = req.user._id.toString();

    try {
        const cursor = await likedCollection.aggregate([
            {
                $match: { userId }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "products",
                    foreignField: "_id",
                    as: "likedProducts"
                }
            },
            {
                $project: {
                    products: 0,
                    userId: 0
                }
            }
        ]);

        const { likedProducts } = (await cursor.toArray())[0];

        for (let product of likedProducts) {
            if (product.photos) {
                refreshToken(appCollection);
                try {
                    const response = await GoogleDriveApi.getFile(product.photos);
                    product.photos = response.data;
                } catch (error) {
                    console.log(error);
                }
            }
        }

        res.send(likedProducts);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getProducts,
    addProduct,
    getProduct,
    likeProduct,
    unlikeProduct,
    getLikedProducts
};