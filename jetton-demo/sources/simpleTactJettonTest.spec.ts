import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import "@ton/test-utils";
import { Address, beginCell, fromNano, StateInit, toNano } from "@ton/core";

// ------------ STON.fi SDK ------------
import { Mint, SimpleTactJetton, TokenTransfer } from "./output/SimpleTactJetton_SimpleTactJetton";
import { JettonDefaultWallet } from "./output/SimpleTactJetton_JettonDefaultWallet";
import { buildOnchainMetadata } from "./utils/jetton-helpers";

describe("contract", () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let testUser: SandboxContract<TreasuryContract>;
    let simpleTactJetton: SandboxContract<SimpleTactJetton>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");
        testUser = await blockchain.treasury("testUser");

        //init param
        const jettonParams = {
            name: "My Ido Jetton",
            description: "This is my second jetton write by Tact-lang",
            symbol: "MIJ",
            image: "https://avatars.githubusercontent.com/u/104382459?s=200&v=4",
        };
        let ownerAddress = deployer.address;
        let content = buildOnchainMetadata(jettonParams);
        let max_supply = toNano(123456766689011);

        simpleTactJetton = blockchain.openContract(await SimpleTactJetton.fromInit(ownerAddress, content, max_supply));

        const deployResult = await simpleTactJetton.send(
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
            to: simpleTactJetton.address,
            deploy: true,
            success: true,
        });

        console.log(`tactJettonAddress:${simpleTactJetton.address}`);
    });

    it("data before test", async () => {
        // token owner
        let balance: bigint = await deployer.getBalance();
        const owner = await simpleTactJetton.getOwner();
        console.log(`owner:${owner} ownerHoldTonBalance:${balance.toString()}`);
    });

    it("jetton mint test", async () => {
        //mint param
        const mintTokenAmount = toNano("18");
        const mintTo = deployer.address;
        const mint: Mint = {
            $$type: "Mint",
            amount: mintTokenAmount,
            receiver: mintTo,
        };
        //gas seems to return if there's any extra
        await simpleTactJetton.send(deployer.getSender(), { value: toNano("0.5") }, mint);
    });


    
    it("jetton transfer test", async () => {
        const transferAmount = toNano(2);
        // const transferTo = Address.parse('EQBKzR0_xH-NX5a_s9nze06GUte6rCOaZABOiC8E6OAnpbU5');
        const transferTo = testUser.address;
        const responseDestination = deployer.address;//The excess gas returns this address
        const transferMessage: TokenTransfer = {
            $$type: 'TokenTransfer',
            query_id: 0n,
            amount: transferAmount,
            sender: transferTo,
            response_destination: responseDestination,
            custom_payload: null,
            forward_ton_amount: toNano('0'),//toNano('0.1'),  //It works without sending ton, I don't know why send ton
            forward_payload: beginCell().storeUint(0, 1).storeUint(0, 32).endCell(),
        };
    
        //sender wallet contract
        const senderWalletContractAddress = await simpleTactJetton.getGetWalletAddress(deployer.address);
        const senderWalletContract =  blockchain.openContract(JettonDefaultWallet.fromAddress(senderWalletContractAddress));
    
        //send token
        await senderWalletContract.send(  deployer.getSender(), { value: toNano('0.5') }, transferMessage);
    });


    
    it("jetton balance after transfer test", async () => {
          //total supply
          const supplyBefore = (await simpleTactJetton.getGetJettonData()).total_supply;
          console.log(`totalSupply:${supplyBefore}`);
  
          //query balance
          const userAddress = testUser.address;
          const userWalletContarctAddress = await simpleTactJetton.getGetWalletAddress(userAddress);
          const userWalletContract = blockchain.openContract(JettonDefaultWallet.fromAddress(userWalletContarctAddress));
          const userWalletData = await userWalletContract.getGetWalletData();
          console.log(
              `userAddress:${userWalletData.owner} userWalletContarctAddress:${userWalletContarctAddress} userHoldJettonBalance:${userWalletData.balance}`
          );
    });
});
