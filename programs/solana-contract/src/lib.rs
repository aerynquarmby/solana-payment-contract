use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use anchor_spl::token::{self, Approve, Token, TokenAccount, Transfer};
use solana_security_txt::security_txt;
#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    // Required fields
    name: "solana",
    project_url: "http://example.com",
    contacts: "email:example@example.com,link:https://example.com/security,discord:example#1234",
    policy: "https://github.com/solana-labs/solana/blob/master/SECURITY.md",

    // Optional Fields
    preferred_languages: "en,de",
    source_code: "https://github.com/example/example",
    auditors: "None",
    acknowledgements: "
The following hackers could've stolen all our money but didn't:
- Neodyme
"
}
declare_id!("8p5kaH1np1p1YL7rSXDPFEmrtg5fwGBxEThmztuEB8en");

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

    pub fn set_fee_wallet(ctx: Context<ManageWhitelist>, fee_wallet: Pubkey) -> Result<()> {
        let vault: &mut Account<Vault> = &mut ctx.accounts.vault;
        require!(
            *ctx.accounts.owner.key == vault.owner,
            CustomError::Unauthorized
        );
        vault.feewallet = fee_wallet;
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

    pub fn purchase_process(
        ctx: Context<PurchaseProcess>,
        amount: u64,
        merchant_fee_bps: u64,
        fee_wallet_bps: u64,
    ) -> Result<()> {
        let vault = &ctx.accounts.vault;

        let (_pda, bump) = Pubkey::find_program_address(&[b"white-list"], ctx.program_id);

        let seeds: &[&[u8]] = &[b"white-list", &[bump]];
        let signer = &[&seeds[..]];

        require!(
            *ctx.accounts.buyer.key == vault.owner,
            CustomError::Unauthorized
        );

        // Calculate fees
        let merchant_fee = ((merchant_fee_bps as f64 / 10000 as f64) * amount as f64) as u64 ;
        let fee_wallet_fee = ((fee_wallet_bps as f64 / 10000 as f64) * amount as f64) as u64 ;
        // msg!("the natural value is {}",merchant_fee_bps);
        // msg!("the divided value is {}",merchant_fee_bps/10000.0);

        // let merchant_fee = merchant_fee_bps / 100;
        // let fee_wallet_fee = fee_wallet_bps / 100;
        let total_fees = merchant_fee + fee_wallet_fee;

        let amount_to_transfer = amount - total_fees;

        let cpi_accounts = Transfer {
            from: ctx.accounts.source.clone(),
            to: ctx.accounts.merchant_token_account.clone(),
            authority: ctx.accounts.delegate.clone(),
        };
        // Transfer merchant fee to merchant wallet

        let cpi_accounts_merchant_fee = Transfer {
            from: ctx.accounts.source.clone(),
            to: ctx.accounts.merchant_token_account.clone(),
            authority: ctx.accounts.delegate.clone(),
        };

        // // Transfer fee wallet fee to fee wallet
        let cpi_accounts_fee_wallet = Transfer {
            from: ctx.accounts.source.clone(),
            to: ctx.accounts.fee_wallet_token_account.clone(),
            authority: ctx.accounts.delegate.clone(),
        };
        let cpi_program = ctx.accounts.token_program.clone();

        let cpi_ctx_fee_wallet =
            CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts_fee_wallet, signer);
        let cpi_ctx_merchant_fee =
            CpiContext::new_with_signer(cpi_program.clone(), cpi_accounts_merchant_fee, signer);
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        // Transfer tokens using the SPL Token program's Transfer instruction
        token::transfer(cpi_context, amount_to_transfer)?;

        // Transfer merchant fee to merchant wallet
        token::transfer(cpi_ctx_merchant_fee, merchant_fee)?;

        token::transfer(cpi_ctx_fee_wallet, fee_wallet_fee)?;

        emit!(ProcessPurchaseEvent {
            purchaser: *ctx.accounts.merchant_token_account.key,
            amount: amount_to_transfer,
            seller_wallet: *ctx.accounts.source.key,
            fee_wallet: ctx.accounts.vault.key(),
            fee: total_fees,
        });

        Ok(())
    }

    pub fn approve_delegate(ctx: Context<ApproveDelegate>, amount: u64) -> Result<()> {
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
}
#[derive(Accounts)]
pub struct TransferOwnerShip<'info> {
    #[account(mut)]
    pub current_authority: Signer<'info>,

    #[account(mut, executable)]
    pub program_id: AccountInfo<'info>,

    #[account(mut,
        seeds = [program_id.key().as_ref()],
        bump,
        seeds::program = BpfLoaderUpgradeable::id()
    )]
    pub program_data: AccountInfo<'info>,
    pub new_authority: AccountInfo<'info>,

    pub system_program: Program<'info, System>,

    pub bpf_upgradable_loader: Program<'info, BpfLoaderUpgradeable>,
}
#[derive(Accounts)]
#[instruction()]
pub struct Initialize<'info> {
    #[account(init, seeds = [b"white-list".as_ref()], bump, payer = owner, space = 8 + 32 + 1024)]
    pub vault: Account<'info, Vault>,
    #[account(mut)]
    pub owner: Signer<'info>,
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
pub struct PurchaseProcess<'info> {
    #[account(seeds = [b"white-list".as_ref()], bump)]
    pub vault: Account<'info, Vault>,
    pub buyer: Signer<'info>,
    #[account(mut)]
    /// CHECK:
    pub source: AccountInfo<'info>, // Token account holding the tokens
    #[account(mut)]
    /// CHECK:
    pub merchant_token_account: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK:
    pub fee_wallet_token_account: AccountInfo<'info>,
    /// CHECK:
    pub delegate: AccountInfo<'info>,
    /// CHECK:
    pub token_program: AccountInfo<'info>, // SPL Token program account
}
#[derive(Accounts)]
pub struct ApproveDelegate<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    #[account(mut)]
    /// CHECK:
    pub delegate: AccountInfo<'info>,
    /// CHECK:
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Vault {
    pub owner: Pubkey,
    pub whitelist: Vec<Pubkey>,
    pub feewallet: Pubkey,
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
}

#[derive(Clone)]
pub struct BpfLoaderUpgradeable();

impl Id for BpfLoaderUpgradeable {
    fn id() -> Pubkey {
        solana_program::bpf_loader_upgradeable::id()
    }
}
