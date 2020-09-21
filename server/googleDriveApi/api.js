const { google } = require('googleapis');

module.exports = {
    listFiles: async function (listFilter) {
        const drive = google.drive('v3');

        let response = null;
        try {
            response = await drive.files.list(listFilter);
        } catch (err) {
            console.log(err);
        }

        return response;
    },

    createFolder: async function (name, parents) {
        const drive = google.drive('v3');
        const fileMetadata = {
            'name': name,
            'mimeType': 'application/vnd.google-apps.folder',
            'parents': parents
        };

        let response = null;
        try {
            response = await drive.files.create(
                {
                    resource: fileMetadata,
                    fields: 'id'
                }
            );
        } catch (err) {
            console.log(err);
        }

        return response;
    },

    uploadFile: async function (name, parents, file) {
        const drive = google.drive('v3');
        const fileMetadata = {
            'name': name,
            'parents': parents
        };
        const media = {
            body: file
        };

        let response = null;
        try {
            response = await drive.files.create(
                {
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                }
            );
        } catch (err) {
            console.log(err);
        }

        return response;
    },

    getFile: async function (fileId) {
        const drive = google.drive('v3');

        let response = null;
        try {
            response = await drive.files.get(
                {
                    fileId,
                    alt: 'media'
                }
            );
        } catch (err) {
            console.log(err);
        }

        return response;
    },

    deleteFile: async function (fileId) {
        const drive = google.drive('v3');

        let response = null;
        try {
            response = await drive.files.delete({ fileId });
        } catch (err) {
            console.log(err);
        }

        return response;
    },

    deleteTrashedFiles: async function () {
        const drive = google.drive('v3');

        let response = null;
        try {
            response = await drive.files.emptyTrash();
        } catch (err) {
            console.log(err);
        }

        return response;
    }
}