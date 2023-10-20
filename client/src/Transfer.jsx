import { useState } from "react";
import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import * as secp from "ethereum-cryptography/secp256k1";
function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    };

    const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));
    console.log(messageHash);

    const sign = secp.secp256k1.sign(messageHash, privateKey);
    const isSigned = secp.secp256k1.verify(sign, messageHash, address);
    console.log(isSigned);

    const body = {
      message,
      isSigned,
    }

    try {
      const {
        data: { balance },
      } = await server.post(`send`, body);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          required
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          required
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Your Wallet Private Key
        <input
          type="password"
          required
          placeholder="Sign With Your Private Key"
          value={privateKey}
          onChange={setValue(setPrivateKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
