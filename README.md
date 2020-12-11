# How to run the app

1. Install [Node.js](https://nodejs.org) (if not installed yet)
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/) (if not installed yet) and start database
3. Install [git](https://git-scm.com) (if not installed yet)
4. Run `git clone https://github.com/nameTaras/testmarketplace.git`
5. Run `npm install` in client and server folder
6. Run `npm run watch` in client folder for work with the client in real time
7. Run `npm run start` in server folder for work with the server in real time
8. Open the [url](https://accounts.google.com/o/oauth2/v2/auth/identifier?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=490829237576-nb6f90tt5h9nvg7d1cmelduh4d6pnmi3.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&flowName=GeneralOAuthFlow). You will be redirected to google quickstart where you should provide access and get code
9. Make request with code which you got "http://localhost:3001/api/setGoogleDriveToken?code="


[https://testmarketplace.herokuapp.com](https://testmarketplace.herokuapp.com/)