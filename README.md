# Solana Smart Contract

Address - CGU1WsfUbydfjimDfLw5PmJNEaYfLUcaYvk5vZhjGSA2

## Installation

Install Rust from https://www.rust-lang.org/tools/install

Install Solana from https://docs.solanalabs.com/cli/install

Instal Anchor from https://www.anchor-lang.com/docs/installation

## Contract

Connect wallet for deployment
Navigate 👉 Anchor.toml file in root

Replace your Solana wallet address path 👇

```[provider]
cluster = "devnet" // DEVNET
wallet = "<home/path/WalletAddress>"
```

Generate your Solana wallet if you do not own it
In terminal excute below command 🔳

```
solana-keygen new
```

Build

```
anchor build
```

We will use already deployed contract for testing, if you want to redeploy you can use => anchor deploy

### Anchor Test

```
npm install  to install pacakges to run test cases
```

```
anchor test --skip-deploy
```

## Code overview

### init_wallet

Initalize a PDA with seed "white-list" to hold whiteList,owner and feeWallet.

### init_token_program

Initialize an associated token program with the seed "token mint address" to hold the user's funds, which will be added by the admin through a call to restricted_balance_deposit.

### add_to_whitelist

Add a public key to the whitelist. Only the authorized wallet can append to the whitelist. Ensures addresses in the list are unique.

### set_fee_wallet

Update the fee wallet. Only the authorized owner can update it.

### remove_from_whitelist

Remove an address from the list. Only the authorized owner can call this function

### approve_delegate

Approve token from the user to delegate, which is our PDA. Later, we can spend the token on behalf of the user in the `process_purchase` function.

### process_purchase

This function processes a purchase by checking the user's balance through the `restricted_balance_deposit` function. If sufficient balance is available, it transfers tokens from the associated token account (ATA). In cases where the user's balance is insufficient, the difference is deducted from the ATA account, and the remaining amount is transferred from the approved token balance. If the user does not have enough balance in `restricted_balance_deposit`, the required amount is deducted directly from the approve token and transferred to the fee wallet and the merchant account. Only public keys listed on the whitelist are authorized to execute this operation.

### restricted_balance_deposit

This function restricts balance deposits by deducting the approved token amount and transferring it to the program's associated token account. The escrow will be held in the program's associated token account and later transferred to other wallets through the `process_purchase` function. Additionally, this function saves the user's balance details for future reference's.

### change_ownership

Change the ownership of the contract. The `change_ownership` function will transfer authority of the contract to a new address that has access to upgrade the contract.
