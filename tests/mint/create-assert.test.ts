import { Transaction } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

import { executeTransaction, MockFactory } from "../../sdk/common";

beforeAll(async () => {
  await MockFactory.create();
});

describe.skip("Create Asset Test", () => {
  it("should mint nft", async () => {
    const { program, connection, backendWallet, collection, asset } =
      MockFactory.mockFactory;

    const tx = new Transaction();
    const ix = await program.methods
      .createAsset(
        "OVB NFT1",
        "https://gateway.pinata.cloud/ipfs/bafkreia7kb345sf3v7x3leys2p24rj6frpa4agfyaqecasyoyk7yarcn2y"
      )
      .accountsPartial({
        signer: backendWallet.publicKey,
        payer: backendWallet.publicKey,
        asset: asset.publicKey,
        collection: collection.publicKey,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const eventListener = program.addEventListener(
      "nftMintedEvent",
      (event) => {
        expect(event.asset.toString()).toEqual(asset.publicKey.toString());
      }
    );

    const txHash = await executeTransaction(connection, tx, backendWallet, {
      signers: [backendWallet.payer, asset.payer],
    });
    console.log("Transaction Hash", txHash);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    program.removeEventListener(eventListener);
  });
});
