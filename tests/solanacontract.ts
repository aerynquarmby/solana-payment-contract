import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContract } from "../target/types/solana_contract";
import { PublicKey } from "@solana/web3.js";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { SYSTEM_PROGRAM_ID } from "@raydium-io/raydium-sdk";
import { getAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { BN } from "bn.js";

const bPfLoader = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
describe("solana-contract", async () => {
  try {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env();

    anchor.setProvider(provider);


    const amount = 100000000;
    const merchent_bps_point = 100;
    const fee_wallet_bps_point = 100;

    // let destinationTokenAccount = new PublicKey(""); //add destinationTokenAccount address of token which you want to use
    // let sourceTokenAccount = new PublicKey("");//add sourceTokenAccount address of token which you want to use
    const payer: any = provider.wallet as anchor.Wallet;

    const payerPublicKey = payer.publicKey;
    const mintAddress = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB") //add mint address of token which you want to use
    const program = anchor.workspace.SolanaContract as Program<SolanaContract>;
    const ProgramId = program.programId;
    const [walletPda, bump] = PublicKey.findProgramAddressSync(
      [utf8.encode("white-list")],
      ProgramId
    );

    const [restritedAccountPda, bumpRestritedAccount] = PublicKey.findProgramAddressSync(
      [payerPublicKey.toBuffer()],
      ProgramId
    );

    const [pdaTokenAccount, bumppdaTokenAccount] = PublicKey.findProgramAddressSync(
      [mintAddress.toBuffer()],
      ProgramId
    );
    const [programData, _bump] = PublicKey.findProgramAddressSync(
      [ProgramId.toBuffer()],
      bPfLoader);
    // const data = await program.account.vault.fetch(walletPda);
    console.log("wallet signature", pdaTokenAccount.toBase58());
    // it("Is initialized wallet!", async () => {

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

    // it("Is initialized token program!", async () => {

    //   const tx = await program.methods
    //     .initTokenProgram()
    //     .accounts({
    //       programStakeAccount: pdaTokenAccount,
    //       vault: walletPda,
    //       mintAddress: mintAddress,
    //       owner: payer.publicKey,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       systemProgram: SYSTEM_PROGRAM_ID
    //     })
    //     .rpc();
    //   console.log("wallet signature", tx);
    // });

    // it("Is Add white-List address!", async () => {

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
    //       restritedAccount: restritedAccountPda,
    //       authority: payer.publicKey,
    //       to: sourceTokenAccount,
    //       delegate: walletPda,
    //       tokenProgram: TOKEN_PROGRAM_ID
    //     }).signers([])
    //     .rpc();
    //   console.log("Your transaction signature", tx);
    // });
    // it("Is Restricted Account balance!", async () => {

    //   const tx = await program.methods
    //     .restrictedBalanceDeposit(payerPublicKey, new BN(amount))
    //     .accounts({
    //       programStakeAccount: pdaTokenAccount,
    //       restritedAccount: restritedAccountPda,
    //       vault: walletPda,
    //       owner: payer.publicKey,
    //       mintAddress: mintAddress,
    //       source: sourceTokenAccount,
    //       to: pdaTokenAccount,
    //       delegate: walletPda,
    //       tokenProgram: TOKEN_PROGRAM_ID,
    //       systemProgram: SYSTEM_PROGRAM_ID
    //     })
    //     .rpc();
    //   console.log("wallet signature", tx);
    // });
    // it("Is process Purchase!", async () => {

    //   const tx = await program.methods
    //     .purchaseProcess(new BN(amount), new BN(merchent_bps_point), new BN(fee_wallet_bps_point))
    //     .accounts({
    //       vault: walletPda,
    // restritedAccount: restritedAccountPda,
    //       pdaTokenAccount: pdaTokenAccount,
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
    it("Is transfer owner-ship!", async () => {

      const tx = await program.methods
        .changeOwnerShip()
        .accounts({
          currentAuthority: payerPublicKey,
          newAuthority: new PublicKey("3aKVAEsQirTuBoC8d3QxbGyR91q7e8oseDF9q7wn63bS"),
          programId: ProgramId,
          bpfUpgradableLoader: bPfLoader,
          programData: programData
        }).signers([payer.payer])
        .rpc();
      console.log("Your transaction signature", tx);
    });

    it("Is change account owner!", async () => {

      const tx = await program.methods
        .changeAccountOwner(new PublicKey("3aKVAEsQirTuBoC8d3QxbGyR91q7e8oseDF9q7wn63bS"))
        .accounts({
          owner: payerPublicKey,
          vault: walletPda,
        }).signers([])
        .rpc();
      console.log("Your transaction signature", tx);
    });
  } catch (error) {
    console.log(error, "error")
  }
});
