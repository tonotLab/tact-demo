import { toNano } from "@ton/core";
import { SimpleTactWallet } from "../sources/output/SimpleTactWallet_SimpleTactWallet";
import { NetworkProvider } from "@ton/blueprint";

export async function run(provider: NetworkProvider) {
    //owner address
    const ownerAddress = provider.sender().address;
    if (!ownerAddress) throw new Error("fail address");

    const simpleTactWallet = provider.open(await SimpleTactWallet.fromInit(ownerAddress));

    await simpleTactWallet.send(
        provider.sender(),
        {
            value: toNano("0.05"),
        },
        {
            $$type: "Deploy",
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(simpleTactWallet.address);
    console.log(`tactWalletAddress:${simpleTactWallet.address}`);
}
