// eslint-disable-next-line import/no-extraneous-dependencies
const { Storage } = require('@google-cloud/storage');
const config = require('./config');

const storage = new Storage({
    keyFilename: './credentials.json',
    projectId: `${config.projectIdGCP}`,
});

const bucketName = `${config.bucketName}`;

module.exports = { storage, bucketName };
