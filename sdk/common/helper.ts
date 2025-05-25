import {
  AnchorProvider,
  Program,
  Provider,
  setProvider,
  Wallet,
} from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { CnftFusion } from "../idl/cnft_fusion";

import IDL from "../idl/cnft_fusion.json";
import { resolve } from "path";
import { readFileSync } from "fs";

export type SolanaProvider = {
  connection: Connection;
  wallet: Wallet;
};

const getTestConnection = (): Connection => {
  const url =
    "https://devnet.helius-rpc.com/?api-key=c468ac4b-f75f-422d-b7c2-b965484d3eaf";
  return new Connection(url, "confirmed");
};

export class MockFactory {
  static mockFactory: MockFactory;

  constructor(
    public program: Program<CnftFusion>,
    public provider: Provider,
    public connection: Connection,
    public backendWallet: Wallet,
    public collection: Wallet,
    public user: Wallet,
    public asset: Wallet,
    public newAsset: Wallet,
    public tokenMint: PublicKey
  ) {
    MockFactory.mockFactory = this;
  }

  static async create(): Promise<MockFactory> {
    const backendKeypair = loadKeypair("./keypairs/main.json");
    const backendWallet = new Wallet(backendKeypair);

    const collectionKeypair = loadKeypair("./keypairs/collection.json");
    const collection = new Wallet(collectionKeypair);

    const assetKeypair = loadKeypair("./keypairs/asset.json");
    const asset = new Wallet(assetKeypair);

    const newAssetKeypair = loadKeypair("./keypairs/new_asset.json");
    const newAsset = new Wallet(newAssetKeypair);

    const userKeypair = loadKeypair("./keypairs/user.json");
    const user = new Wallet(userKeypair);

    const connection = await getTestConnection();

    const provider = new AnchorProvider(connection, backendWallet, {
      commitment: "confirmed",
    });
    setProvider(provider);

    const veraluxInterface = JSON.parse(JSON.stringify(IDL));
    const program = new Program<CnftFusion>(
      veraluxInterface
    ) as Program<CnftFusion>;

    let tokenMint = new PublicKey(process.env.TOKEN!);

    return new MockFactory(
      program,
      provider,
      connection,
      backendWallet,
      collection,
      user,
      asset,
      newAsset,
      tokenMint
    );
  }
}

export const loadKeypair = (filePath: string): Keypair => {
  const absolutePath = resolve(filePath);
  const keypairString = readFileSync(absolutePath, "utf-8");
  const keypairBuffer = Buffer.from(JSON.parse(keypairString));
  return Keypair.fromSecretKey(keypairBuffer);
};
