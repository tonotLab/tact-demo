import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
} from "@ton/sandbox";
import "@ton/test-utils";
import { Address, beginCell, fromNano, StateInit, toNano } from "@ton/core";

// ------------ STON.fi SDK ------------
import {  SimpleTact } from "./output/SimpleTact_SimpleTact";

describe("contract", () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let simpleTact: SandboxContract<SimpleTact>;

    beforeAll(async () => {
        // Create content Cell

        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");

        simpleTact = blockchain.openContract( await SimpleTact.fromInit());


        const deployResult = await simpleTact.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: simpleTact.address,
            deploy: true,
            success: true,
        });

        // console.log(`addres:${simpleTact.address}`);
    });



    it("Test: test AskDump", async () => {
        
           //gas seems to return if there's any extra

           await simpleTact.send(deployer.getSender(), { value: toNano('0.5') }, "AskDump");

    });


});