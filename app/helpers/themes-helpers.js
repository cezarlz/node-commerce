const glob = require('glob');
const path = require('path');
const json = require('jsonfile');
const manifestsPath = path.resolve(__dirname, '../views/themes/**/manifest.json'); 

module.exports = {
  getThemes: () => {
    const manifests = [];

    return new Promise((resolve, reject) => {
      glob(manifestsPath, function (err, files) {
        if (!err) {
          files.forEach((file) => {
            let obj = json.readFileSync(file);

            manifests.push(obj);
          });

          return resolve(manifests);
        }

        return reject(err);
      });
    });
  }
};