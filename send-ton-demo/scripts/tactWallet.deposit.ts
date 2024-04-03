import { Address, OpenedContract, Sender, beginCell, toNano } from "@ton/core";
import { SimpleTactWallet } from "../sources/output/SimpleTactWallet_SimpleTactWallet";
import { compile, NetworkProvider } from "@ton/blueprint";

//Execute the "tactWallet.deploy.ts" script to get the new token address
const tactWalletAddress = Address.parse("EQAo9eiGxWrVrYjNt5U5WUZGB3sM4xaahPiMJQijrN766sj3");

export async function run(provider: NetworkProvider) {
    // open Contract instance by address
    const simpleTactWallet = provider.open(SimpleTactWallet.fromAddress(tactWalletAddress));
    //gas seems to return if there's any extra
    const depositAmount = toNano("0.2");
    await simpleTactWallet.send(provider.sender(), { value: depositAmount }, "Deposit");
}
