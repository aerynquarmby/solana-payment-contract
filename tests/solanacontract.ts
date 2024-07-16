import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContract } from "../target/types/solana_contract";
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { SYSTEM_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { createAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { BN } from "bn.js";
const bPfLoader = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
describe("solana-contract", async () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

  anchor.setProvider(provider);

  const amount = 100000000;
  const merchent_bps_point = 100;
  const fee_wallet_bps_point = 100;

  let transactionSignature: string;
  let destinationTokenAccount;
  let mint;
  let sourceTokenAccount
  const payer: any = provider.wallet as anchor.Wallet;

  const randomKeypair = new Keypair();
  const payyer  // Wallet keypair
  const payerPublicKey = payer.publicKey;

  const program = anchor.workspace.SolanaContract as Program<SolanaContract>;
  const ProgramId = program.programId;
  const [walletPda, bump] = PublicKey.findProgramAddressSync(
    [utf8.encode("white-list")],
    ProgramId
  );

  const [programData, _bump] = PublicKey.findProgramAddressSync(
    [ProgramId.toBuffer()],
    bPfLoader);

  it("Fetch owner!", async () => {
    const tx = await program.account.vault.fetch(walletPda)
    // .changeAccountOwner(new PublicKey("3aKVAEsQirTuBoC8d3QxbGyR91q7e8oseDF9q7wn63bS"))
    // .accounts({
    //   owner: payerPublicKey,
    //   vault: walletPda,
    //   systemProgram: SystemProgram.programId
    // }).signers([])
    // .rpc();
    console.log("Your transaction signature", tx);
  });
  // it("Is mint!", async () => {
  //   const mintRandom = new Keypair();

  //   mint = await createMint(
  //     connection,
  //     payyer,
  //     payer.publicKey,
  //     null,
  //     8,
  //     // mintRandom
  //   )

  //   console.log(
  //     "Mint Account: ",
  //     `https://explorer.solana.com/address/${mint.toString()}?cluster=devnet`
  //   );
  //   // Random keypair to use as owner of Token Account

  //   // Create Token Account for random keypair
  //   sourceTokenAccount = await createAccount(
  //     connection,
  //     payyer, // Payer to create Token Account
  //     mint, // Mint Account address
  //     randomKeypair.publicKey // Token Account owner
  //   );

  //   // Create Token Account for Playground wallet
  //   destinationTokenAccount = await createAccount(
  //     connection,
  //     payyer, // Payer to create Token Account
  //     mint, // Mint Account address
  //     payer.publicKey // Token Account owner
  //   );

  //   // Mint tokens to sourceTokenAccount, owned by randomKeypair
  //   transactionSignature = await mintTo(
  //     connection,
  //     payyer, // Transaction fee payer
  //     mint, // Mint Account address
  //     sourceTokenAccount, // Mint to
  //     payerPublicKey, // Mint Authority address
  //     1000000000000 // Amount
  //   );

  //   console.log(
  //     "\nMint Tokens:",
  //     `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
  //   );
  // })

  // it("Is initialized wallet!", async () => {
  //   //this function is for one time call and accounts will take three arguments one is signer address and other is wallet pda account which we have create up side and last will be system program ID.

  //   const tx = await program.methods
  //     .initWallet()
  //     .accounts({
  //       owner: payer.publicKey,
  //       vault: walletPda,
  //       systemProgram: SYSTEM_PROGRAM_ID,
  //     })
  //     .rpc();
  //   console.log("wallet signature", tx);
  // });

  // it("Is Add white-List address!", async () => {
  //   // this function takes the parameter of wallet address which owner wallet to add in whitelist array and accounts will take two arguments one is wallet initialized address for first time and other is wallet pda account
  //   const tx = await program.methods
  //     .addToWhitelist(new PublicKey("2Etbf1ua9fyUgjeq4vDC8xKCHWn4uKGjRGwK8da4maYk"))
  //     .accounts({
  //       owner: payer.publicKey,
  //       vault: walletPda,
  //     })
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });
  // it("Is remove white-List address!", async () => {
  //   // this function takes the parameter of wallet address which owner wallet to remove from whitelist array and accounts will take two arguments one is owner or whitelist address  and other is wallet pda account
  //   const tx = await program.methods
  //     .removeFromWhitelist(payer.publicKey)
  //     .accounts({
  //       owner: payer.publicKey,
  //       vault: walletPda,
  //     })
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });
  // it("Is set fee Wallet !", async () => {
  //   // this function takes the parameter of fee wallet address which owner wallet to add/replace from feeWallet of vault and accounts will take two arguments one is owner or whitelist address  and other is wallet pda account
  //   const tx = await program.methods
  //     .setFeeWallet(new PublicKey("3aKVAEsQirTuBoC8d3QxbGyR91q7e8oseDF9q7wn63bS"))
  //     .accounts({
  //       owner: payer.publicKey,
  //       vault: walletPda,
  //     })
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Is approve spl token !", async () => {

  //   const tx = await program.methods
  //     .approveDelegate(new BN(amount))
  //     .accounts({
  //       authority: randomKeypair.publicKey,
  //       to: sourceTokenAccount,
  //       delegate: walletPda,
  //       tokenProgram: TOKEN_PROGRAM_ID
  //     }).signers([randomKeypair])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Is process Purchase!", async () => {

  //   const tx = await program.methods
  //     .purchaseProcess(new BN(amount), new BN(merchent_bps_point), new BN(fee_wallet_bps_point))
  //     .accounts({
  //       vault: walletPda,
  //       buyer: payerPublicKey,
  //       source: sourceTokenAccount,
  //       merchantTokenAccount: destinationTokenAccount,
  //       feeWalletTokenAccount: destinationTokenAccount,
  //       delegate: walletPda,
  //       tokenProgram: TOKEN_PROGRAM_ID
  //     }).signers([])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });
  // it("Is transfer owner-ship!", async () => {

  //   const tx = await program.methods
  //     .changeOwnerShip()
  //     .accounts({
  //       currentAuthority: payerPublicKey,
  //       newAuthority: new PublicKey("3aKVAEsQirTuBoC8d3QxbGyR91q7e8oseDF9q7wn63bS"),
  //       programId: ProgramId,
  //       bpfUpgradableLoader: bPfLoader,
  //       programData: programData
  //     }).signers([payer.payer])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Is change account owner!", async () => {

  //   const tx = await program.methods
  //     .changeAccountOwner(new PublicKey("3aKVAEsQirTuBoC8d3QxbGyR91q7e8oseDF9q7wn63bS"))
  //     .accounts({
  //       owner: payerPublicKey,
  //       vault: walletPda,
  //       systemProgram: SystemProgram.programId
  //     }).signers([])
  //     .rpc();
  //   console.log("Your transaction signature", tx);
  // });
});
