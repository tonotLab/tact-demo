import { Address, OpenedContract, toNano } from '@ton/core';
import { SimpleTactWallet, Withdraw } from "../sources/output/SimpleTactWallet_SimpleTactWallet";
import { compile, NetworkProvider } from '@ton/blueprint';

//Execute the "tactWallet.deploy.ts" script to get the new token address
const tactWalletAddress = Address.parse("EQAo9eiGxWrVrYjNt5U5WUZGB3sM4xaahPiMJQijrN766sj3");

export async function run(provider: NetworkProvider) {
   // open Contract instance by address
   const simpleTactWallet = provider.open(SimpleTactWallet.fromAddress(tactWalletAddress));

    const withdrawAmount = toNano(0.12);
        const withdrawMessage: Withdraw = {
            $$type: "Withdraw",
            amount: withdrawAmount,
        };

        //withdraw
        await simpleTactWallet.send(provider.sender(), { value: toNano("0.01") }, withdrawMessage);

}
