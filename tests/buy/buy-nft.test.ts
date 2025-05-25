import { Transaction } from "@solana/web3.js";
import { BN } from "bn.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

import { executeTransaction, MockFactory } from "../../sdk/common";

beforeAll(async () => {
  await MockFactory.create();
});

describe("Buy NFT Test", () => {
  it("should buy the nft", async () => {
    const {
      program,
      connection,
      backendWallet,
      tokenMint,
      user,
      asset,
      newAsset,
      collection,
    } = MockFactory.mockFactory;

    const solAmount = 2 * Math.pow(10, 9);
    const tokenAmount = 1000 * Math.pow(10, 9);

    const tokenAta = await getOrCreateAssociatedTokenAccount(
      connection,
      backendWallet.payer,
      tokenMint,
      backendWallet.publicKey
    );

    const userAta = await getOrCreateAssociatedTokenAccount(
      connection,
      backendWallet.payer,
      tokenMint,
      user.publicKey
    );

    const tx = new Transaction();
    const ix = await program.methods
      .buyNft(
        new BN(solAmount),
        new BN(tokenAmount),
        "OVB Test User NFT",
        "https://gateway.pinata.cloud/ipfs/bafkreieebfdagu3jfitlk2hk54lfwdonwvzv2xnxlz7cngbmio4vjqxoxe"
      )
      .accountsPartial({
        tokenMint,
        signer: backendWallet.publicKey,
        payer: user.publicKey,
        collection: collection.publicKey,
        asset: asset.publicKey,
        newAsset: newAsset.publicKey,
        tokenAta: tokenAta.address,
        userAta: userAta.address,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .instruction();

    tx.add(ix);

    const txHash = await executeTransaction(connection, tx, user, {
      signers: [backendWallet.payer, user.payer, asset.payer, newAsset.payer],
    });
    console.log("Transaction Hash", txHash);
  });
});
