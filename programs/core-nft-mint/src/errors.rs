use anchor_lang::prelude::*;

#[error_code]
pub enum CNFTFusionError {
    #[msg("Reentrancy guard triggered: Operation already in progress")]
    ReentrancyGuardTriggered,
    #[msg("Unauthorized: Invalid global admin")]
    InvalidAdmin,
    #[msg("Incorrect token ata")]
    IncorrectATA,
    #[msg("Incorrect token mint")]
    IncorrectMint,
}
