# Solana Smart Contract

## Installation

Install Rust from https://www.rust-lang.org/tools/install

Install Solana from https://docs.solanalabs.com/cli/install

Instal Anchor from https://www.anchor-lang.com/docs/installation

## Contract 
Connect wallet for deployment
Navigate 👉 Anchor.toml file in root

Replace your Solana wallet address path 👇

``` [provider]
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

### add_to_whitelist
Add a public key to the whitelist. Only the authorized wallet can append to the whitelist. Ensures addresses in the list are unique.



### set_fee_wallet

Update the fee wallet. Only the authorized owner can update it.

### remove_from_whitelist

Remove an address from the list. Only the authorized owner can call this function

### approve_delegate

Approve token from the user to delegate, which is our PDA. Later, we can spend the token on behalf of the user in the `process_purchase` function.

### process_prchase

Process the purchase, deduct the approved token from the buyer's wallet address, and transfer it to the fee wallet and merchant account. Only public keys in the whitelist can execute this operation.

### change_ownership

Change the ownership of the contract. The `change_ownership` function will transfer authority of the contract to a new address that has access to upgrade the contract.