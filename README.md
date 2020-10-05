# How to run the app

1. git clone https://github.com/nameTaras/testmarketplace.git
2. Run `npm install` in client and server folder
3. Run `npm run watch` in client folder for work with the client in real time
4. Run `npm run start` in server folder
5. Open the [url](https://accounts.google.com/o/oauth2/v2/auth/identifier?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive&response_type=code&client_id=490829237576-nb6f90tt5h9nvg7d1cmelduh4d6pnmi3.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&flowName=GeneralOAuthFlow). You will be redirected to google quickstart where you should provide access and get code
6. Make request with code which you got "http://localhost:3001/api/setGoogleDriveToken?code="


[https://testmarketplace.herokuapp.com](https://testmarketplace.herokuapp.com/)