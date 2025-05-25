use anchor_lang::prelude::*;

#[event]
pub struct SolPaymentReceivedEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
}

#[event]
pub struct TokenPaymentReceivedEvent {
    pub from: Pubkey,
    pub to: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
}

#[event]
pub struct CreateCollectionEvent {
    pub collection: Pubkey,
    pub name: String,
    pub uri: String,
}

#[event]
pub struct NftMintedEvent {
    pub recipient: Pubkey,
    pub asset: Pubkey,
}

#[event]
pub struct NftBurnedEvent {
    pub owner: Pubkey,
    pub asset: Pubkey,
}

#[event]
pub struct NewNftMintedEvent {
    pub recipient: Pubkey,
    pub new_asset: Pubkey,
}
