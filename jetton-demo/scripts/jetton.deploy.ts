import { toNano } from '@ton/core';
import {  SimpleTactJetton } from "../sources/output/SimpleTactJetton_SimpleTactJetton";
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../sources/utils/jetton-helpers';

export async function run(provider: NetworkProvider) {
    //owner address
    const ownerAddress = provider.sender().address;
    if (!ownerAddress) throw new Error('fail address');
    
    //init param
    const jettonParams = {
        name: 'My Simple Jetton demo',
        description: 'This is my first jetton write by Tact-lang',
        symbol: 'MSJD',
        image: 'https://avatars.githubusercontent.com/u/104382459?s=200&v=4',
    };
    let content = buildOnchainMetadata(jettonParams);
    let max_supply = toNano(123456766689011);

    //初始化
    const simpleTactJetton = provider.open(await SimpleTactJetton.fromInit(ownerAddress, content, max_supply));

    await simpleTactJetton.send(
        provider.sender(),
        {
            value: toNano('0.15'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(simpleTactJetton.address);
    console.log(`tactJettonAddress:${simpleTactJetton.address}`);

    // run methods on `simpleTactJetton`
}
