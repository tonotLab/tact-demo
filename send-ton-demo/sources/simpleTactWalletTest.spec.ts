import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import "@ton/test-utils";
import { Address, beginCell, fromNano, StateInit, toNano } from "@ton/core";

// ------------ STON.fi SDK ------------
import { SimpleTactWallet, Withdraw } from "./output/SimpleTactWallet_SimpleTactWallet";

describe("contract", () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleTactWallet: SandboxContract<SimpleTactWallet>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");

        let ownerAddress = deployer.address;
        simpleTactWallet = blockchain.openContract(await SimpleTactWallet.fromInit(ownerAddress));

        const deployResult = await simpleTactWallet.send(
            deployer.getSender(),
            {
                value: toNano("0.05"),
            },
            {
                $$type: "Deploy",
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleTactWallet.address,
            deploy: true,
            success: true,
        });

        console.log(`contractAddress:${simpleTactWallet.address}`);
    });

    it("data before test", async () => {
        let balance: bigint = await deployer.getBalance();
        console.log(`deployer:${deployer.address} ownerHoldTonBalance:${balance}`);
    });

    it("deposit test", async () => {
        //gas seems to return if there's any extra
        const depositAmount = toNano(2);
        await simpleTactWallet.send(deployer.getSender(), { value: depositAmount }, "Deposit");

        let contractHoldTon = await simpleTactWallet.getBalance();
        console.log(`contract:${simpleTactWallet.address} contractHoldTon:${contractHoldTon}`);
    });

    it("withdraw test", async () => {
        const withdrawAmount = toNano(0.5);
        const withdrawMessage: Withdraw = {
            $$type: "Withdraw",
            amount: withdrawAmount,
        };

        //withdraw
        await simpleTactWallet.send(deployer.getSender(), { value: toNano("0.01") }, withdrawMessage);

        //check balance
        let contractHoldTon = await simpleTactWallet.getBalance();
        console.log(`contract:${simpleTactWallet.address} contractHoldTon:${contractHoldTon}`);
    });
});
