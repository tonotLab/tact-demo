import { Address, OpenedContract, toNano } from '@ton/core';
import { Mint, SimpleTactJetton } from "../sources/output/SimpleTactJetton_SimpleTactJetton";
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonDefaultWallet } from "../sources/output/SimpleTactJetton_JettonDefaultWallet";

//Execute the "jetton.deploy.ts" script to get the new token address
const jettonTokenAddress = Address.parse('EQCYZpEV6cCeLIVA19KoecD0T3wclipaRmBEYcFAM8rLssGJ');
const userAddress = Address.parse('UQCzbXfGcjRkFj2incswDfLoHhEYzewOKwQ7oseKNZpqpP1T');

export async function run(provider: NetworkProvider) {
    // token owner
    const simpleTactJetton = provider.open(SimpleTactJetton.fromAddress(jettonTokenAddress));
    const owner = await simpleTactJetton.getOwner();
    console.log(`owner:${owner}`);

    //total supply
    const supplyBefore = (await simpleTactJetton.getGetJettonData()).total_supply;
    console.log(`totalSupply:${supplyBefore}`);

    //query balance
    const userWalletContarctAddress = await simpleTactJetton.getGetWalletAddress(userAddress);
    const userWalletContract = provider.open(JettonDefaultWallet.fromAddress(userWalletContarctAddress));
    const userWalletData = await userWalletContract.getGetWalletData();
    console.log(`user:${userWalletData.owner} userBalance:${userWalletData.balance}`);
}
