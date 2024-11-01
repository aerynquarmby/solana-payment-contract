use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use anchor_spl::token::{self, Approve, Mint, Token, TokenAccount, Transfer};
use solana_security_txt::security_txt;
#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    // Required fields
    name: "Xion Global",
    project_url: "https://xion.global",
    contacts: "contact@xion.global,
    link:https://xion.global,telegram:@xionglobal",
    policy: "https://github.com/solana-labs/solana/blob/master/SECURITY.md",
    // Optional Fields
    preferred_languages: "en,de",
    source_code: "",
    auditors: "None",
    acknowledgements: ""
}
declare_id!("2kX5Vc47ABpaErfFUTzqFDcRs5ZRknYkdHhAtvCt8SbJ");
#[program]
pub mod solana_contract {

    use super::*;
    // One-time function call which creates an Account to store the Fee Wallet, WhiteListed Address, and the owner who calls the function
    pub fn init_wallet(ctx: Context<Initialize>) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;
        vault.owner = *ctx.accounts.owner.key;
        vault.whitelist = Vec::new();

        Ok(())
    }

    pub fn init_token_program(ctx: Context<InitializeTokenAccount>) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;

        require!(
            *ctx.accounts.owner.key == vault.owner,
            CustomError::Unauthorized
        );
        Ok(())
    }

    pub fn add_to_whitelist(ctx: Context<ManageWhitelist>, user: Pubkey) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;
        require!(
            *ctx.accounts.owner.key == vault.owner,
            CustomError::Unauthorized
        );

        if !vault.whitelist.contains(&user) {
            vault.whitelist.push(user);
        } else {
            return Err(CustomError::UserAlreadyWhitelisted.into());
        }
        Ok(())
    }

    pub fn remove_from_whitelist(ctx: Context<ManageWhitelist>, user: Pubkey) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;
        require!(
            *ctx.accounts.owner.key == vault.owner,
            CustomError::Unauthorized
        );

        if !vault.whitelist.contains(&user) {
            return Err(CustomError::UserNotWhitelisted.into());
        }
        vault.whitelist.retain(|&x| x != user);
        Ok(())
    }

    pub fn set_fee_wallet(ctx: Context<ManageWhitelist>, fee_wallet: Pubkey) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;
        require!(
            *ctx.accounts.owner.key == vault.owner,
            CustomError::Unauthorized
        );
        vault.feewallet = fee_wallet;
        Ok(())
    }

    pub fn approve_delegate(ctx: Context<ApproveDelegate>, amount: u64) -> Result<()> {
        let restricted_account = &mut ctx.accounts.restrited_account;

        restricted_account.user_address = ctx.accounts.authority.key();

        let cpi_accounts = Approve {
            to: ctx.accounts.to.to_account_info(),
            delegate: ctx.accounts.delegate.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::approve(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn purchase_process(
        ctx: Context<PurchaseProcess>,
        amount: u64,
        merchant_fee_bps: u64,
        fee_wallet_bps: u64,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;
        let restrited_account = &mut ctx.accounts.restrited_account;
        let mint_address = ctx.accounts.source.mint.key();

        // Deriving PDA and bump seed
        let (_pda, bump) = Pubkey::find_program_address(&[b"white-list"], ctx.program_id);
        let seeds: &[&[u8]] = &[b"white-list", &[bump]];
        let signer = &[&seeds[..]];

        // Authorization check
        require!(
            *ctx.accounts.buyer.key == vault.owner
                || vault.whitelist.contains(&ctx.accounts.buyer.key),
            CustomError::Unauthorized
        );
        require!(
            ctx.accounts.source.owner == restrited_account.user_address,
            CustomError::Unauthorized
        );

        // Calculate fees using integer math to avoid precision issues
        let merchant_fee = ((merchant_fee_bps as f64 / 10000 as f64) * amount as f64) as u64;
        let fee_wallet_fee = ((fee_wallet_bps as f64 / 10000 as f64) * amount as f64) as u64;
        let total_fees = merchant_fee + fee_wallet_fee;

        // Ensure total fees do not exceed the amount being transferred
        require!(amount > total_fees, CustomError::InsufficientFundsForFees);

        let mut amount_to_transfer = amount - total_fees;
        let restricted_balance = restrited_account.balance; // Assuming `balance` is the field holding restricted tokens
        let mut restricted_amount_used = 0;

        if restricted_balance > 0 {
            let (_pda, _program_stake_bump) =
                Pubkey::find_program_address(&[mint_address.to_bytes().as_ref()], ctx.program_id);

            let seeds_stake: &[&[u8]] = &[mint_address.as_ref(), &[_program_stake_bump]];

            let signer_stake = &[&seeds_stake[..]];

            restricted_amount_used = std::cmp::min(amount_to_transfer, restricted_balance); // Take as much as possible from restricted balance

            amount_to_transfer -= restricted_amount_used;

            // Transfer restricted tokens to merchant
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_accounts_restricted = Transfer {
                from: ctx.accounts.pda_token_account.to_account_info(),
                to: ctx.accounts.merchant_token_account.to_account_info(),
                authority: ctx.accounts.pda_token_account.to_account_info(),
            };
            let cpi_ctx_restricted = CpiContext::new_with_signer(
                cpi_program.clone(),
                cpi_accounts_restricted,
                signer_stake,
            );
            token::transfer(cpi_ctx_restricted, restricted_amount_used)?;

            // If there's any remaining amount after using restricted balance, transfer from the source account
            if amount_to_transfer > 0 {
                let cpi_program = ctx.accounts.token_program.to_account_info();
                let cpi_accounts_transfer = Transfer {
                    from: ctx.accounts.source.to_account_info(),
                    to: ctx.accounts.merchant_token_account.to_account_info(),
                    authority: ctx.accounts.delegate.to_account_info(),
                };

                let cpi_ctx_transfer =
                    CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts_transfer, signer);
                token::transfer(cpi_ctx_transfer, amount_to_transfer)?;
                // Transfer fee to fee wallet
                let cpi_accounts_fee_wallet = Transfer {
                    from: ctx.accounts.source.to_account_info(),
                    to: ctx.accounts.fee_wallet_token_account.to_account_info(),
                    authority: ctx.accounts.delegate.to_account_info(),
                };
                let cpi_ctx_fee_wallet = CpiContext::new_with_signer(
                    cpi_program.clone(),
                    cpi_accounts_fee_wallet,
                    signer,
                );

                // Transfer merchant fee
                let cpi_accounts_merchant_fee = Transfer {
                    from: ctx.accounts.source.to_account_info(),
                    to: ctx.accounts.merchant_token_account.to_account_info(),
                    authority: ctx.accounts.delegate.to_account_info(),
                };
                let cpi_ctx_merchant_fee = CpiContext::new_with_signer(
                    cpi_program.clone(),
                    cpi_accounts_merchant_fee,
                    signer,
                );
                token::transfer(cpi_ctx_fee_wallet, fee_wallet_fee)?;

                token::transfer(cpi_ctx_merchant_fee, merchant_fee)?;
            }
            restrited_account.balance = restrited_account
                .balance
                .checked_sub(restricted_amount_used)
                .ok_or(CustomError::OverFlowError)?;
        // restrited_account.balance -= restricted_amount_used;
        } else {
            // Set up transfer accounts for the merchant and fee wallets
            let cpi_program = ctx.accounts.token_program.to_account_info();

            // Transfer tokens to the merchant account (remaining amount after fees)
            let cpi_accounts_transfer = Transfer {
                from: ctx.accounts.source.to_account_info(),
                to: ctx.accounts.merchant_token_account.to_account_info(),
                authority: ctx.accounts.delegate.to_account_info(),
            };
            let cpi_ctx_transfer =
                CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts_transfer, signer);
            token::transfer(cpi_ctx_transfer, amount_to_transfer)?;

            // Transfer merchant fee
            let cpi_accounts_merchant_fee = Transfer {
                from: ctx.accounts.source.to_account_info(),
                to: ctx.accounts.merchant_token_account.to_account_info(),
                authority: ctx.accounts.delegate.to_account_info(),
            };
            let cpi_ctx_merchant_fee =
                CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts_merchant_fee, signer);
            token::transfer(cpi_ctx_merchant_fee, merchant_fee)?;

            // Transfer fee to fee wallet
            let cpi_accounts_fee_wallet = Transfer {
                from: ctx.accounts.source.to_account_info(),
                to: ctx.accounts.fee_wallet_token_account.to_account_info(),
                authority: ctx.accounts.delegate.to_account_info(),
            };
            let cpi_ctx_fee_wallet =
                CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts_fee_wallet, signer);
            token::transfer(cpi_ctx_fee_wallet, fee_wallet_fee)?;
        }

        // Emit an event after successful processing
        emit!(ProcessPurchaseEvent {
            purchaser: ctx.accounts.merchant_token_account.key(),
            amount: amount_to_transfer,
            seller_wallet: ctx.accounts.source.key(),
            fee_wallet: ctx.accounts.vault.key(),
            fee: total_fees,
        });

        Ok(())
    }

    pub fn restricted_balance_deposit(
        ctx: Context<InitializeRestrictedAccount>,
        user: Pubkey,
        amount: u64,
    ) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;

        let (_pda, bump) = Pubkey::find_program_address(&[b"white-list"], ctx.program_id);

        let seeds: &[&[u8]] = &[b"white-list", &[bump]];
        let signer = &[&seeds[..]];
        let restricted_account = &mut ctx.accounts.restrited_account;

        require!(
            *ctx.accounts.owner.key == vault.owner
                || vault.whitelist.contains(&ctx.accounts.owner.key),
            CustomError::Unauthorized
        );

        require!(ctx.accounts.source.owner == user, CustomError::Unauthorized);
        
        restricted_account.user_address = user;
        restricted_account.balance += amount;

        let cpi_accounts = Transfer {
            from: ctx.accounts.source.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.delegate.clone(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn change_owner_ship(ctx: Context<TransferOwnerShip>) -> Result<()> {
        let ix = solana_program::bpf_loader_upgradeable::set_upgrade_authority(
            &ctx.accounts.program_id.key,
            &ctx.accounts.current_authority.key,
            Some(&ctx.accounts.new_authority.key),
        );
        solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.program_data.to_account_info(),
                ctx.accounts.current_authority.to_account_info(),
                ctx.accounts.new_authority.to_account_info(),
            ],
        )?;
        Ok(())
    }

    pub fn change_account_owner(ctx: Context<ChangeAccountOwner>, new_owner: Pubkey) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;
        require!(
            *ctx.accounts.owner.key == vault.owner,
            CustomError::Unauthorized
        );
        vault.owner = new_owner;
        Ok(())
    }

    pub fn close_vault(_ctx: Context<CloseVault>) -> Result<()> {
        let payer = _ctx.accounts.identity.key();
        let _vault: &mut Account<'_, Vault> = &mut _ctx.accounts.vault;

        require!(payer != _vault.owner, CustomError::Unauthorized);

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(init, seeds = [b"white-list".as_ref()], bump, payer = owner, space = 8 + 32 + 9000)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(mut, close = identity )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub identity: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeTokenAccount<'info> {
    #[ account(
        init,
        payer = owner,
        seeds = [ mint_address.key().as_ref() ],
        bump,
        token::mint = mint_address,
        token::authority = program_stake_account,
    )]
    pub program_stake_account: Account<'info, TokenAccount>,
    pub vault: Account<'info, Vault>,

    pub mint_address: Account<'info, Mint>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(user:Pubkey)]
pub struct InitializeRestrictedAccount<'info> {
    #[account(init_if_needed, seeds = [user.key().as_ref()], bump, payer = owner, space =  1000)]
    pub restrited_account: Account<'info, RestrictedAccount>,
    #[account(
        mut,
        seeds = [ mint_address.key().as_ref() ],
        bump
    )]
    pub program_stake_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub mint_address: Account<'info, Mint>,

    #[account(mut)]
    pub source: Account<'info, TokenAccount>, // Token account holding the tokens
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    /// CHECK:
    pub delegate: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ManageWhitelist<'info> {
    #[account(mut, seeds = [b"white-list".as_ref()], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ApproveDelegate<'info> {
    #[account(init_if_needed, seeds = [authority.key().as_ref()], bump, payer = authority, space =  1000)]
    pub restrited_account: Account<'info, RestrictedAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK:
    pub delegate: AccountInfo<'info>,
    /// CHECK:
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseProcess<'info> {
    #[account(seeds = [b"white-list".as_ref()], bump)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub restrited_account: Account<'info, RestrictedAccount>,
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub source: Account<'info, TokenAccount>, // Token account holding the tokens
    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>, // Token account where token will be transfer
    #[account(mut)]
    pub fee_wallet_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pda_token_account: Account<'info, TokenAccount>, // Token account from where token will be transfer
    /// CHECK:
    pub delegate: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction()]
pub struct ChangeAccountOwner<'info> {
    #[account(mut, seeds = [b"white-list".as_ref()], bump ,has_one = owner)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferOwnerShip<'info> {
    #[account(mut)]
    pub current_authority: Signer<'info>,

    #[account(mut, executable)]
    /// CHECK:
    pub program_id: AccountInfo<'info>,

    #[account(mut,
        seeds = [program_id.key().as_ref()],
        bump,
        seeds::program = BpfLoaderUpgradeable::id()
    )]
    /// CHECK:
    pub program_data: AccountInfo<'info>,
    /// CHECK:
    pub new_authority: AccountInfo<'info>,
    /// CHECK:
    pub system_program: Program<'info, System>,
    /// CHECK:
    pub bpf_upgradable_loader: Program<'info, BpfLoaderUpgradeable>,
}

#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub whitelist: Vec<Pubkey>,
    pub feewallet: Pubkey,
}

#[account]
pub struct RestrictedAccount {
    pub user_address: Pubkey,
    pub balance: u64,
}

#[event]
pub struct ProcessPurchaseEvent {
    pub purchaser: Pubkey,
    pub amount: u64,
    pub seller_wallet: Pubkey,
    pub fee_wallet: Pubkey,
    pub fee: u64,
}
#[error_code]
pub enum CustomError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Not Whitelisted")]
    NotWhitelisted,
    #[msg("User is already whitelisted")]
    UserAlreadyWhitelisted,
    #[msg("User is not whitelisted")]
    UserNotWhitelisted,
    #[msg("Invalid fee basis points.")]
    InvalidFee,
    #[msg("Insufficient funds after fees.")]
    InsufficientFundsForFees,
    #[msg("Unauthorized delegate.")]
    UnauthorizedDelegate,
    #[msg("Restricted account.")]
    RestrictedAccount,
    #[msg("Invalid delegate provided.")]
    InvalidDelegate,
    #[msg("number error overflow")]
    OverFlowError,
}

#[derive(Clone)]
pub struct BpfLoaderUpgradeable();

impl Id for BpfLoaderUpgradeable {
    fn id() -> Pubkey {
        solana_program::bpf_loader_upgradeable::id()
    }
}
