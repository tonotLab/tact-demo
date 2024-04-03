import { Address, OpenedContract, Sender, beginCell, toNano } from '@ton/core';
import { Mint, SimpleTactJetton, TokenTransfer } from "../sources/output/SimpleTactJetton_SimpleTactJetton";
import { compile, NetworkProvider } from '@ton/blueprint';
import { JettonDefaultWallet } from "../sources/output/SimpleTactJetton_JettonDefaultWallet";

//Execute the "jetton.deploy.ts" script to get the new token address
const jettonTokenAddress = Address.parse('EQCYZpEV6cCeLIVA19KoecD0T3wclipaRmBEYcFAM8rLssGJ');
const transferTo = Address.parse('UQCzbXfGcjRkFj2incswDfLoHhEYzewOKwQ7oseKNZpqpP1T');

export async function run(provider: NetworkProvider) {
    // open Contract instance by address
    const simpleTactJetton = provider.open(SimpleTactJetton.fromAddress(jettonTokenAddress));

    // Transfer param
    const sender: Sender = provider.sender();
    const senderAddress = sender.address;
    if (!senderAddress) throw new Error('fail sender');
    const transferAmount = toNano(2);
    const transferMessage: TokenTransfer = {
        $$type: 'TokenTransfer',
        query_id: 0n,
        amount: transferAmount,
        sender: transferTo,
        response_destination: senderAddress,
        custom_payload: null,
        forward_ton_amount: toNano('0'),//toNano('0.1'),  //It works without sending ton, I don't know why send ton
        forward_payload: beginCell().storeUint(0, 1).storeUint(0, 32).endCell(),
    };

    //sender wallet contract
    const senderWalletContractAddress = await simpleTactJetton.getGetWalletAddress(sender.address);
    const senderWalletContract = provider.open(JettonDefaultWallet.fromAddress(senderWalletContractAddress));

    //send token
    await senderWalletContract.send(sender, { value: toNano('0.5') }, transferMessage);
}
