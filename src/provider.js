import { ProviderRpcClient } from "everscale-inpage-provider";
import {
  EverscaleStandaloneClient,
  SimpleKeystore,
} from "everscale-standalone-client/nodejs.js";

const getProvider = async () => {
  try {
    const client = new ProviderRpcClient({
      fallback: () =>
        EverscaleStandaloneClient.create({
          connection: {
            id: 1002,
            group: "devnet",
            type: "jrpc",
            data: {
              endpoint: ["https://jrpc-devnet.venom.foundation/"],
            },
          },
        }),
    });
    await client.ensureInitialized();
    await client.requestPermissions({ permissions: ["basic"] });
    return client;
  } catch (err) {
    console.log(err);
  }
};

export default getProvider;
