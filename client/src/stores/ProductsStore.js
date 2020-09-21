import { types as t } from "mobx-state-tree";
import Api from "../api.js";

export const ProductsModel = t
	.model("ProductsModel", {
		_id: t.string,
		title: t.string,
		location: t.string,
		description: t.optional(t.string, ""),
		photos: t.array(t.string),
		price: t.optional(t.string, ""),
		ownerId: t.string
	});

export const ProductListModel = t
	.model("ProductListModel", {
		list: t.array(ProductsModel),
		listById: t.array(ProductsModel)
	})
	.views(store => ({
		getStoresProduct(productId) {
			return store.list.find(product => product._id === productId);
		}
	}))
	.actions(store => ({
		async addProduct(productData) {
			const { title, location, description, photos, price } = productData;

			let formData = new FormData();
			formData.append('title', title);
			formData.append('location', location);
			formData.append('description', description);
			formData.append('price', price);
			formData.append('photos', JSON.stringify(photos));
			
			const method = "POST";
			const contentType = "";
			const options = Api.getOptions(method, contentType, formData);
			const endpoint = "/addProduct";

			const { response, responseData } = await Api.request(endpoint, options);
			store.onLoadAddProductSuccess(responseData, photos);

			return response;
		},

		onLoadAddProductSuccess(product, photos) {
			const productExist = store.list.some(item => item._id === product._id);
			product.photos = photos;
			!productExist && store.list.push(product);
		},

		async getProduct(productId) {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = `/getProduct?id=${productId}`;

			const { response, responseData } = await Api.request(endpoint, options);
			store.onLoadGetProductSuccess(responseData);

			return response;
		},

		onLoadGetProductSuccess(product) {
			const productExist = store.list.some(item => item._id === product._id);
			!productExist && store.list.push(product);
		},

		async getProducts(filter) {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			let endpoint = "/getProducts?";
			for (let item in filter) {
				endpoint += item + "=" + filter[item] + "&";
			}

			const { response, responseData } = await Api.request(endpoint, options);
			store.onLoadGetProductsSuccess(responseData, filter);
			return response;
		},

		onLoadGetProductsSuccess(productsList, filter) {
			filter.ownerId ? store.listById = productsList : store.list = productsList;
		}
	}))