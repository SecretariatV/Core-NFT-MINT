import { Transaction } from "@solana/web3.js";
import { executeTransaction, MockFactory } from "../../sdk/common";

beforeAll(async () => {
  await MockFactory.create();
});

describe.skip("Global Init Test", () => {
  it("should initialize the global", async () => {
    const { program, connection, backendWallet } = MockFactory.mockFactory;

    const tx = new Transaction();
    const ix = await program.methods
      .initGlobal()
      .accounts({
        payer: backendWallet.publicKey,
      })
      .instruction();

    tx.add(ix);

    const txHash = await executeTransaction(connection, tx, backendWallet);
    console.log("Transaction Hash", txHash);
  });
});
