import React from 'react';
import NavBar from "./navBar/navBar.js";
import SearchBar from "./searchBar/searchBar.js";
import SavedProductsTable from "./savedProductsTable/savedProductsTable.js";
import PersonInfoTable from "./personInfoTable/personInfoTable.js";
import HomePage from "./homePage/homePage.js";
import LoginForm from "./loginForm/loginForm.js";
import AddProductForm from "./addProductForm/addProductForm.js";
import RestorePasswordForm from "./restorePasswordForm/restorePasswordForm.js";
import RegisterForm from "./registerForm/registerForm.js";
import EditProfileForm from "./editProfileForm/editProfileForm.js";
import ProductInfo from "./productInfo/productInfo.js";
import ChatsPage from "./chatsPage/chatsPage.js";

function Home(props) {
	return (
			<>
				<NavBar store={props.store} />
				<SearchBar />
				<HomePage store={props.store} />
			</>			
		);
}

function AddProduct(props) {
	return (
			<>
				<NavBar store={props.store} />
				<AddProductForm />
			</>		
		);
}

function LogIn(props) {
	return (
			<>
				<NavBar store={props.store} />
				<LoginForm />
			</>		
		);
}

function RestorePassword(props) {
	return (
			<>
	            <NavBar store={props.store} />
	            <RestorePasswordForm />
			</>	
		);
}

function SignUp(props) {
	return (
			<>
	            <NavBar store={props.store} />
	            <RegisterForm />
			</>		
		);
}

function EditProfile(props) {
	return (
			<>
            	<NavBar store={props.store} />
	            <EditProfileForm />
			</>		
		);
}

function ProductInformation(props) {
	return (
			<>
	            <NavBar store={props.store} />
	            <SearchBar />
	            <ProductInfo store={props.store} />
			</>		
		);
}

function Chats(props) {
	return (
			<>
	            <NavBar store={props.store} />
	            <ChatsPage store={props.store} socket={props.socket} />
			</>		
		);
}

function PersonInfo(props) {
	return (
			<>
	            <NavBar store={props.store} />
	            <SearchBar />
	            <PersonInfoTable store={props.store} />
			</>			
		);
}

function SavedList(props) {
	return (
			<>
	            <NavBar store={props.store} />
	            <SearchBar />
	            <SavedProductsTable store={props.store} />
			</>			
		);
}

export default {
	Home,
	AddProduct,
	LogIn,
	RestorePassword,
	SignUp,
	EditProfile,
	ProductInformation,
	Chats,
	PersonInfo,
	SavedList
};