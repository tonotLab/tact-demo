import "@stdlib/deploy";
message Withdraw {
    amount: Int as coins;
}

contract SimpleTactWallet with Deployable {
    deposited_total: Int as coins;
    owner: Address;
    init(owner: Address){
        self.deposited_total = 0;
        self.owner = owner;
    }

    receive("Deposit"){
        let ctx: Context = context();
        require(ctx.value > 0, "Deposit value");
        self.deposited_total += ctx.value;
        dump(">>>>>>>>>>>>>>>>>>>>>>>>>deposit finish");
        dump(self.deposited_total);
    }

    receive(msg: Withdraw){
        dump("================Withdraw start");
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(msg.amount <= myBalance(), "Left balance");
        require(msg.amount > 0, "Withdraw amount");
        send(SendParameters{
                to: sender(),
                bounce: true,
                value: msg.amount,
                mode: (SendRemainingValue + SendIgnoreErrors)
            }
        );
        dump("================Withdraw finish");
    }

    get fun balance(): String {
        return myBalance().toCoinsString();
    }
}