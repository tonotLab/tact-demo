import { Address, OpenedContract, toNano } from "@ton/core";
import { Mint, SimpleTactJetton } from "../sources/output/SimpleTactJetton_SimpleTactJetton";
import { compile, NetworkProvider } from "@ton/blueprint";

//Execute the "jetton.deploy.ts" script to get the new token address
const jettonTokenAddress = Address.parse("EQCYZpEV6cCeLIVA19KoecD0T3wclipaRmBEYcFAM8rLssGJ");
let mintTo: any; //default is owner

export async function run(provider: NetworkProvider) {
    mintTo = provider.sender()?.address; // Address.parse('EQB523xDhlFh19gJQQQ0md9xBM68RvEfamFupgIjWSIQHuUA');
    if (!mintTo) throw new Error("fail");

    // open Contract instance by address
    const simpleTactJetton = provider.open(SimpleTactJetton.fromAddress(jettonTokenAddress));
    const owner = await simpleTactJetton.getOwner();
    console.log(`owner:${owner}`);

    const supplyBefore = (await simpleTactJetton.getGetJettonData()).total_supply;
    console.log(`supplyBefore:${supplyBefore}`);

    //mint param
    const mintTokenAmount = toNano("18");
    const mint: Mint = {
        $$type: "Mint",
        amount: mintTokenAmount,
        receiver: mintTo,
    };
    //gas seems to return if there's any extra
    await simpleTactJetton.send(provider.sender(), { value: toNano("0.5") }, mint);
}
