import { Transaction } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

import { executeTransaction, MockFactory } from "../../sdk/common";

beforeAll(async () => {
  await MockFactory.create();
});

describe.skip("Create Collection Test", () => {
  it("should create nft collection", async () => {
    const { program, connection, backendWallet, collection } =
      MockFactory.mockFactory;

    const tx = new Transaction();
    const ix = await program.methods
      .createCollection(
        "Ares Core NFT Collection",
        "https://gateway.pinata.cloud/ipfs/bafkreih6hrrszxlgiyiagmcygqdeqwvwj3aec4bgs677v25qjb3xr7ln4y"
      )
      .accountsPartial({
        collection: collection.publicKey,
        payer: backendWallet.publicKey,
        signer: backendWallet.publicKey,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const eventListener = program.addEventListener(
      "createCollectionEvent",
      (event) => {
        expect(event.name).toEqual("Ares Core NFT Collection");
        expect(event.collection.toString()).toBe(
          collection.publicKey.toString()
        );
      }
    );

    const txHash = await executeTransaction(connection, tx, backendWallet, {
      signers: [collection.payer, backendWallet.payer],
    });
    console.log("Transaction Hash", txHash);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    program.removeEventListener(eventListener);
  });
});
