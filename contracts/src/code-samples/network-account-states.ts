import { Bool, Field, method, SmartContract, state, State, UInt32, UInt64 } from "o1js";

const initialState = Field(0);
class SimpleZkapp extends SmartContract {
    @state(Field) x = State(initialState);

    @method.returns(Field)
    async update(y: Field) {
        // !!!normal account states cases!!!
        this.account.provedState.requireEquals(Bool(false));
        this.account.delegate.requireEquals(this.address);
        this.account.nonce.requireBetween(new UInt32(1), new UInt32(100));
        this.account.balance.requireBetween(new UInt64(1 * 10 ** 9), new UInt64(100 * 10 ** 9));

        // !!!normal network states cases!!!
        const currentBlockHeight = this.network.blockchainLength.get();
        this.network.blockchainLength.requireBetween(currentBlockHeight, currentBlockHeight.add(100));

        let currentSlot = this.network.globalSlotSinceGenesis.get();
        this.network.globalSlotSinceGenesis.requireBetween(
            currentSlot,
            currentSlot.add(10)
        );




        
        let x = this.x.getAndRequireEquals();
        let newX = x.add(y);
        this.x.set(newX);// updates
        return newX;
    }
}
