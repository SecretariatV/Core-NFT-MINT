import { Wallet } from "@coral-xyz/anchor";
import {
  AddressLookupTableAccount,
  ConfirmOptions,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  sendAndConfirmRawTransaction,
  SendTransactionError,
  Signer,
  SimulatedTransactionResponse,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export async function executeTransaction(
  connection: Connection,
  tx: Transaction,
  wallet: Wallet,
  config?: {
    lookupTableIds?: PublicKey[];
    signers?: Signer[];
    silent?: boolean;
    confirmOptions?: ConfirmOptions;
  }
): Promise<string> {
  const blockhash = (await connection.getLatestBlockhash()).blockhash;
  const lookupTableAccounts = config?.lookupTableIds
    ? (
        await Promise.all(
          config.lookupTableIds.map((lookupTableId) =>
            connection.getAddressLookupTable(lookupTableId)
          ) ?? []
        )
      )
        .map((lut) => lut.value)
        .filter((x): x is AddressLookupTableAccount => x !== null)
    : [];

  const messageV0 = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: blockhash,
    instructions: tx.instructions,
  }).compileToV0Message(lookupTableAccounts);

  let transactionV0 = new VersionedTransaction(messageV0);
  transactionV0 = await wallet.signTransaction(transactionV0);

  if (config?.signers) {
    transactionV0.sign(config.signers ?? []);
  }

  try {
    const txid = await sendAndConfirmRawTransaction(
      connection,
      Buffer.from(transactionV0.serialize()),
      config?.confirmOptions
    );

    return txid;
  } catch (e) {
    if (!config?.silent) {
      logError(e);
    }
    throw e;
  }
}

export async function simulateTransaction(
  connection: Connection,
  tx: Transaction,
  wallet: Wallet,
  signers?: Signer[]
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet does not have a valid public key");
  }

  tx.feePayer = wallet.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  if (signers) {
    tx.sign(...signers);
  }

  try {
    const simulateResponse: RpcResponseAndContext<SimulatedTransactionResponse> =
      await connection.simulateTransaction(tx);

    const simulatedTransaction = simulateResponse.value;

    if (simulatedTransaction.err) {
      throw new Error(
        `Simulation error: ${JSON.stringify(simulatedTransaction.err)}`
      );
    }

    return (
      simulatedTransaction.logs?.join("\n") ||
      "Transaction simulated successfully without errors"
    );
  } catch (error) {
    console.error("Error simulating transaction:", error);
    throw error;
  }
}

const logError = (e: unknown) => {
  const message = (e as SendTransactionError).message ?? "";
  const logs = (e as SendTransactionError).logs;
  if (logs) {
    console.log(logs, message);
  } else {
    console.log(e, message);
  }
};
