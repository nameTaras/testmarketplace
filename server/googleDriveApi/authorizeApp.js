const { google } = require('googleapis');
const querystring = require('querystring');
const GoogleDriveApi = require("./api.js");
const Config = require("../../config/config.server.js");
const { Console } = require('console');

const { client_secret, client_id, redirect_uris } = Config.googleDriveCredentials;
const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

async function setTokenExpiry_date(appCollection, expiry_date, refresh_token) {
    let app = null;
    try {
        app = await appCollection.findOne({});
    } catch (error) {
        console.log(error);
    }

    try {
        if (app) {
            await appCollection.findOneAndUpdate(
                {},
                {
                    $set: {
                        googleDriveRefreshToken: {
                            refreshToken,
                            expiry_date
                        }
                    }
                }
            );
        } else {
            await appCollection.insertOne({
                googleDriveRefreshToken: {
                    refreshToken,
                    expiry_date
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
}

async function refreshToken(appCollection) {
    let app = null;
    try {
        app = await appCollection.findOne({});
    } catch (err) {
        console.log(err);
    }

    const expiry_date = app.googleDriveRefreshToken.expiry_date;
    const atThisMoment = Date.now();

    if (atThisMoment > expiry_date) {
        try {
            const { res, tokens } = 
                await oAuth2Client.refreshToken(refreshToken);
            const { refresh_token } = querystring.parse(res.config.data);

            oAuth2Client.setCredentials(tokens);
            google.options({ auth: oAuth2Client });
            setTokenExpiry_date(appCollection, tokens.expiry_date, refresh_token);
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports.refreshToken = refreshToken;

module.exports.AuthorizeAppToGoogleDrive = async function (dbClient, tokens, oAuth2Client) {
    const db = dbClient.db("marketplaceApp");
    const appCollection = db.collection("app");

    let app = null;
    try {
        app = await appCollection.findOne({});
    } catch (err) {
        console.log(err);
    }

    oAuth2Client.setCredentials(tokens);
    google.options({ auth: oAuth2Client });

    try {
        await setTokenExpiry_date(appCollection, tokens.expiry_date, tokens.refresh_token);
    } catch (error) {
        console.log(error);
    }

    googleDriveFolders = JSON.parse(Config.googleDriveFolders);
    let resRootFolder = null;
    try {
        resRootFolder = await GoogleDriveApi.listFiles(
            {
                fields: 'files(id, name)',
                q: `mimeType = 'application/vnd.google-apps.folder' and fullText contains '${googleDriveFolders[0]}'`
            }
        );
    } catch (err) {
        console.log(err);
    }

    let rootFolder = null
    if (resRootFolder) rootFolder = resRootFolder.data.files[0];

    let allFolders = null;
    let childrenFolders = null;
    if (rootFolder) {
        try {
            const resChildrenFolders = await GoogleDriveApi.listFiles(
                {
                    fields: 'files(id, name)',
                    q: `'${rootFolder.id}' in parents`,
                }
            );
            childrenFolders = resChildrenFolders.data.files;
            allFolders = childrenFolders.slice();
            allFolders.push(rootFolder);
        } catch (err) {
            console.err(err);
        }
    }

    const isNumberOfGoogleFoldersCorrect =
        allFolders && allFolders.length === googleDriveFolders.length;
    const isMatchNumberOfFoldersIdInMongodbCorrect =
        app && Object.keys(app.googleDriveFolders).length === googleDriveFolders.length;

    let areFoldersIdEquivalent = null;
    if (isNumberOfGoogleFoldersCorrect && isMatchNumberOfFoldersIdInMongodbCorrect) {
        areFoldersIdEquivalent = allFolders.every(folder => 
            Object.values(app.googleDriveFolders).includes(folder.id)
        );
        
        if (areFoldersIdEquivalent) return;
    }

    try {
        await appCollection.findOneAndUpdate(
            {},
            {
                $set: {
                    googleDriveFolders: {}
                }
            }
        );
    } catch (err) {
        console.log(err);
    }

    const parent = [];
    const hierarchyGoogleFolders = {};
    for (let folder of googleDriveFolders) {
        try {
            const response = await GoogleDriveApi.createFolder(folder, parent);
            const folderId = response.data.id;
            hierarchyGoogleFolders[folder] = folderId;
            parent.length === 0 && parent.push(folderId);
        } catch (err) {
            console.log(err);
        }
    }

    try {
        app = await appCollection.findOneAndUpdate(
            {},
            {
                $set: {
                    googleDriveFolders: hierarchyGoogleFolders
                }
            },
            {
                returnOriginal: false
            }
        );
    } catch (err) {
        console.log(err);
    }

    if (childrenFolders) {
        for (let folder of childrenFolders) {
            const resFolderFiles = await GoogleDriveApi.listFiles(
                {
                    fields: 'files(id, name)',
                    q: `'${folder.id}' in parents`,
                }
            );

            if (resFolderFiles && resFolderFiles.data.files) {
                for (let file of resFolderFiles.data.files) {
                    const resGetFile = await GoogleDriveApi.getFile(file.id);
                    const folderId = hierarchyGoogleFolders[folder.name];
                    await GoogleDriveApi.uploadFile(file.name, [folderId], resGetFile.data);
                }
            }
        }
    }

    await GoogleDriveApi.deleteFile(rootFolder.id);

    await GoogleDriveApi.deleteTrashedFiles();
    
    return { authorized: true }
}