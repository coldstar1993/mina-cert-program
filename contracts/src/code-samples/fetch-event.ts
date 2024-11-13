import {
    Field,
    state,
    State,
    method,
    SmartContract,
    DeployArgs,
    Permissions,
    Struct,
    Mina,
    PrivateKey,
    UInt32,
    fetchEvents
} from 'o1js';

export class UpdateEvent extends Struct({
    before: Field,
    after: Field
}) { }

let initialState = Field(1);
export class SimpleZkapp extends SmartContract {

    @state(Field) x = State<Field>(initialState);

    // !!! define events
    events = {
        "update": UpdateEvent,
        "input": Field,
    }

    @method.returns(Field)
    async update(y: Field) {
        let x = this.x.getAndRequireEquals()
        let newX = x.add(y);
        this.x.set(newX);

        // !!! emit event 1
        this.emitEvent("input", y);
        // !!! emit event 2
        this.emitEvent("update", new UpdateEvent({ before: x, after: newX }));

        return newX;
    }
}

let zkappKey = PrivateKey.random();
let zkappAccount = zkappKey.toPublicKey();
let zkapp = new SimpleZkapp(zkappAccount);

// !!!manner one
const events0 = await fetchEvents({ publicKey: zkappAccount.toBase58() });

// !!!manner two
const startBlockHeight = new UInt32(366241);
const endBlockHeight = startBlockHeight.add(100);
const event1 = await zkapp.fetchEvents(startBlockHeight, endBlockHeight);