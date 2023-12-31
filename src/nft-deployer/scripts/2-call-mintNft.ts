import { toNano, WalletTypes } from "locklift";
const fs = require("fs");
const path = require("path");

// you can get this parameter as (await locklift.keystore.getSigner("0"))! if you have a seed phrase sets up in key section of locklift config
// or you can pass this parameter by cli or get them by some file reading for example
// if phrase or secret was not set up in key section, calling (await locklift.keystore.getSigner("0"))! will give you a different results from launch to lauch
// we just hardcode it here
const COLLECTION_DEPLOY_PUBLIC_KEY = "e85f61aaef0ea43afc14e08e6bd46c3b996974c495a881baccc58760f6349300";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const collectionArtifacts = await locklift.factory.getContractArtifacts("Collection");
  const nftArtifacts = await locklift.factory.getContractArtifacts("NFT");

  const fileName = process.argv[7];

  const paramsPath = path.join(process.cwd(), "deploy-conf", `${fileName}.json`);

  const params = JSON.parse(fs.readFileSync(paramsPath, "utf8"));

  const json = params.json;
  //const json = JSON.stringify(testJson);

  // calculation of deployed Collection contract address
  const collectionAddress = params.collectionAddress;
  const owner = params.creatorAddress;

  const collectionInsance = await locklift.factory.getDeployedContract("Collection", collectionAddress);

  // creating new account for Collection calling (or you can get already deployed by locklift.factory.accounts.addExistingAccount)
  const { account: someAccount } = await locklift.factory.accounts.addNewAccount({
    type: WalletTypes.WalletV3,
    value: toNano(10),
    publicKey: signer.publicKey,
  });
  // call mintNft function
  // firstly get current nft id (totalSupply) for future NFT address calculating
  const { count: id } = await collectionInsance.methods.totalSupply({ answerId: 0 }).call();
  await collectionInsance.methods.mintNft({ json, owner }).send({ from: someAccount.address, amount: toNano(1) });
  const { nft: nftAddress } = await collectionInsance.methods.nftAddress({ answerId: 0, id: id }).call();

  console.log(`NFT: ${nftAddress.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
