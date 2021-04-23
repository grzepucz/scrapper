const fs = require('fs');
const path = require('path');
const { env } = require('process');

const CACHE_DIR_PATH = `${env.PWD}/${env.CACHE_DIR}`;

class PurgerJob {
    run() {
        return new Promise((resolve, reject) => {
            fs.readdir(CACHE_DIR_PATH, (err, files) => {
                if (err) {
                    reject(err);
                    throw err;
                }

                const result = files.map((file) => {
                    const filePath = path.join(CACHE_DIR_PATH, file);

                    fs.unlink(filePath, (error) => {
                        if (error) {
                            reject(error);
                            throw err;
                        }
                        console.log(`Removed ${filePath}`);
                    });

                    return {
                        status: true,
                        file: filePath,
                    };
                });

                resolve(result);
            });
        });
    }
}

module.exports = PurgerJob;
