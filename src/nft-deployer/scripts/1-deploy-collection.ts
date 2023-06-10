const fs = require("fs");
const path = require("path");

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const nftArtifacts = await locklift.factory.getContractArtifacts("NFT");
  const indexArtifacts = await locklift.factory.getContractArtifacts("Index");
  const indexBasisArtifacts = await locklift.factory.getContractArtifacts("IndexBasis");

  const fileName = process.argv[7];

  const currentPath = process.cwd();

  const paramsPath = path.join(process.cwd(), "deploy-conf", `${fileName}.json`);

  const params = JSON.parse(fs.readFileSync(paramsPath, "utf8"));

  const json = JSON.stringify(params.json);

  const royaltyReceiver_ = params.creatorAddress;
  const royaltyPercent_ = params.royaltyPercent.toFixed(2) * 100;

  const { contract: sample, tx } = await locklift.factory.deployContract({
    contract: "Collection",
    publicKey: signer.publicKey,
    initParams: {},
    constructorParams: {
      royaltyReceiver_,
      royaltyPercent_,
      codeNft: nftArtifacts.code,
      codeIndex: indexArtifacts.code,
      codeIndexBasis: indexBasisArtifacts.code,
      json, // EXAMPLE...not by TIP-4.2
    },
    value: locklift.utils.toNano(1),
  });
  console.log(`Collection deployed at: ${sample.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
