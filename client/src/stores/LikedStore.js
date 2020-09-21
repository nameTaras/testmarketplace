import { types as t } from "mobx-state-tree";
import { ProductsModel } from "./ProductsStore.js";
import Api from "../api.js";

export const LikedListModel = t
	.model("LikedListModel", {
		list: t.array(ProductsModel)
	})
	.views(store => ({
		isProductLiked(productId) {
			return store.list.find(product => product._id === productId);
		}
	}))
	.actions(store => ({
		async likeProduct(productData, productId) {
			const method = "PUT";
			const contentType = "application/json";
			const body = JSON.stringify({ productId });
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/likeProduct";

			const { response } = await Api.request(endpoint, options);
			store.likeProductSuccess(productData);

			return response;
		},

		likeProductSuccess(productData) {
			store.list.push(productData.toJSON());
		},

		async unlikeProduct(productId) {
			const method = "PUT";
			const contentType = "application/json";
			const body = JSON.stringify({ productId });
			const options = Api.getOptions(method, contentType, body);
			const endpoint = "/unlikeProduct";

			const { response } = await Api.request(endpoint, options);
			store.unlikeProductSuccess(productId);

			return response;
		},

		unlikeProductSuccess(productId) {
			store.list.splice(store.list.findIndex(product => product._id === productId), 1);
		},

		async getLikedProducts() {
			const method = "GET";
			const contentType = "application/json";
			const options = Api.getOptions(method, contentType);
			const endpoint = "/getLikedProducts";

			const { users } = JSON.parse(window.localStorage.getItem("__persist")) || { users: { list: [] } };

			if (users.list.length && users.list.some(user => user.isAuthenticated === true)) {
				const { responseData } = await Api.request(endpoint, options);
				store.onLoadgetLikedProductsSuccess(responseData);

				return responseData;
			} else {
				const { likedProducts } =
					JSON.parse(window.localStorage.getItem("LikedList")) || { likedProducts: [] };
				store.onLoadgetLikedProductsSuccess(likedProducts);

				return likedProducts;
			};
		},

		onLoadgetLikedProductsSuccess(likedProducts) {
			store.list = likedProducts;
		}
	}));