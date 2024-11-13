import { fetchAccount, Field, PrivateKey, SmartContract, State, state } from "o1js";


class SimpleContract extends SmartContract {
    @state(Field) x = State<Field>(Field(0));
}

// manner one
const zkAppKey = PrivateKey.random();
const zkAppAddr = zkAppKey.toPublicKey();
const accountDetails = (await fetchAccount({ publicKey: zkAppAddr })).account;


// manner two
const zkApp = new SimpleContract(zkAppAddr);
const x = await zkApp.x.fetch();
