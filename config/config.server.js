module.exports = {
    PORT: process.env.PORT || 3001,
    uriMongodb: process.env.uriMongodb || "mongodb://localhost:27017",
    environment: process.env.environment || "development",
    googleDriveFolders:
        process.env.googleDriveFolders || '["testFiles", "testProductsPhoto", "testUploadedFiles", "testUsersPhoto"]',
    googleDriveCredentials: {
        client_secret: "QKRfiuxkSoNazIPgu3aOu9uS",
        client_id: "490829237576-nb6f90tt5h9nvg7d1cmelduh4d6pnmi3.apps.googleusercontent.com",
        redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"],
        project_id: "quickstart-1598783682820",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs"
    }
};