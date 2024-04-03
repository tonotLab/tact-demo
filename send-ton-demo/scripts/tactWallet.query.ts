import { Address, OpenedContract, toNano } from "@ton/core";
import { compile, NetworkProvider } from "@ton/blueprint";
import { SimpleTactWallet } from "../sources/output/SimpleTactWallet_SimpleTactWallet";

//Execute the "tactWallet.deploy.ts" script to get the new token address
const tactWalletAddress = Address.parse("EQAo9eiGxWrVrYjNt5U5WUZGB3sM4xaahPiMJQijrN766sj3");
let mintTo: any; //default is owner

export async function run(provider: NetworkProvider) {
    // open Contract instance by address
    const simpleTactWallet = provider.open(SimpleTactWallet.fromAddress(tactWalletAddress));

    //check balance
    let contractHoldTon = await simpleTactWallet.getBalance();
    console.log(`contract:${simpleTactWallet.address} contractHoldTon:${contractHoldTon}`);
}
