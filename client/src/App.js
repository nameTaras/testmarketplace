import React from 'react';
import Modal from 'react-modal';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Provider, observer } from 'mobx-react';
import Routes from "./routes.js";
import store from "./stores/RootStore.js";
import { socket } from "./socketio.js";

function PrivateRoute({ children, ...rest }) {
  const renderFunc = ({ location }) => {
    const { isAuthenticated } = store.users.isAuthenticated;
    return isAuthenticated ? 
      children : (<Redirect to={{ pathname: "/logIn", state: { from: location } }} />);
  }

  return (
    <Route {...rest} render={renderFunc} />
  );
}

function AuthenticatedClousedRoute({ children, ...rest }) {
  const renderFunc = ({ location }) => {
    const { isAuthenticated } = store.users.isAuthenticated;
    return isAuthenticated ? 
      (<Redirect to={{ pathname: "/", state: { from: location } }} />) : children
  }

  return (
    <Route {...rest} render={renderFunc} />
  );
}

class App extends React.Component {
  render() {
    socket.appStore = store;
    return (
      <Provider store={store} socket={socket}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Routes.Home store={store}/>
            </Route>
            <PrivateRoute path="/addProduct">
              <Routes.AddProduct store={store}/>
            </PrivateRoute>
            <AuthenticatedClousedRoute path="/logIn">
              <Routes.LogIn store={store}/>
            </AuthenticatedClousedRoute>
            <AuthenticatedClousedRoute path="/restorePassword">
              <Routes.RestorePassword store={store}/>
            </AuthenticatedClousedRoute>
            <AuthenticatedClousedRoute path="/signUp">
              <Routes.SignUp store={store}/>
            </AuthenticatedClousedRoute>
            <PrivateRoute path="/editProfile">
              <Routes.EditProfile store={store}/>
            </PrivateRoute>
            <Route path="/productInfo">
              <Routes.ProductInformation store={store}/>
            </Route>
            <PrivateRoute path="/chats">
              <Routes.Chats store={store} socket={socket}/>
            </PrivateRoute>
            <Route path="/personInfo">
              <Routes.PersonInfo store={store}/>
            </Route>
            <Route path="/savedList">
              <Routes.SavedList store={store}/>
            </Route>
          </Switch>
        </BrowserRouter>
      </Provider>
    )
  }
}

Modal.setAppElement('#modalRoot');
const ObserverApp = observer(App);

export default ObserverApp;