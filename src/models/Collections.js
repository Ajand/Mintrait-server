import { exec } from "child_process";

//run -s ./scripts/1-deploy-collection.ts -n local

const getCollectionAddress = (msg) => {
  return msg.substring(msg.length - 67, msg.length);
};

const deployCollection = async () => {
  return new Promise((resolve, reject) => {
    exec(
      "cd src/nft-deployer && npx locklift run -s ./scripts/1-deploy-collection.ts -n local",
      (error, stdout, stderr) => {
        if (error) {
          console.log("error: ", error);
          return reject(error);
        }
        if (stderr) {
          console.log("stderr: ", stderr);

          return reject(stderr);
        }
        console.log("stdout: ", stdout);
        console.log(getCollectionAddress(stdout));
        return resolve(stdout);
      }
    );
  });
};

export { deployCollection };
