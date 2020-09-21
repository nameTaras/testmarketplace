const readline = require("readline");
const open = require("open");
const { google } = require('googleapis');

module.exports = async function (oAuth2Client) {
    // const code = await new Promise((resolve, reject) => {
    //     const authorizeUrl = oAuth2Client.generateAuthUrl({
    //         access_type: 'offline',
    //         scope: ['https://www.googleapis.com/auth/drive']
    //     });
    //     console.log('Authorize this app by visiting this url:', authorizeUrl);
    //     open(authorizeUrl);

    //     const rl = readline.createInterface({
    //         input: process.stdin,
    //         output: process.stdout
    //     });

    //     rl.question("Input your code: ", answer => {
    //         rl.close();

    //         if (answer === "") {
    //             reject(new Error("Invalid code"));
    //             return;
    //         }

    //         resolve(answer);
    //     });
    // });

    // try {
    //     const { tokens } = await oAuth2Client.getToken(code);
    //     oAuth2Client.setCredentials(tokens);
    //     google.options({ auth: oAuth2Client });

    //     return tokens;
    // } catch (err) {
    //     console.log(err);
    // }
}