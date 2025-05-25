use anchor_lang::prelude::*;

pub mod buy;
pub mod constraint;
pub mod errors;
pub mod events;
pub mod global;
pub mod mint;

pub use buy::*;
pub use constraint::*;
pub use errors::*;
pub use events::*;
pub use global::*;
pub use mint::*;

declare_id!("7xRaTzzgBCXBoGhPL7WxQnkhQBE4VtEYgXu3ezvoQpRq");

#[program]
pub mod core_nft_mint {
    use super::*;

    /// Global
    pub fn init_global(ctx: Context<InitGlobalCtx>) -> Result<()> {
        InitGlobalCtx::handler(ctx)
    }

    /// Mint
    pub fn create_collection(
        ctx: Context<CreateCollectionCtx>,
        name: String,
        uri: String,
    ) -> Result<()> {
        CreateCollectionCtx::handler(ctx, name, uri)
    }

    pub fn create_asset(ctx: Context<CreateAssetCtx>, name: String, uri: String) -> Result<()> {
        CreateAssetCtx::handler(ctx, name, uri)
    }

    pub fn buy_nft(
        ctx: Context<BuyNftCtx>,
        sol_amount: u64,
        token_amount: u64,
        name: String,
        uri: String,
    ) -> Result<()> {
        BuyNftCtx::handler(ctx, sol_amount, token_amount, name, uri)
    }
}
