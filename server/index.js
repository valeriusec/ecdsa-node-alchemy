const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  //private key:  ccb50c82bf96cc52f13118ae0ae436115fea2261db66be7b05cf60fa9e0d3489
  "030930b2677e98f2922533cfb94476a4939f53e30c171152f98af396c03f01a868": 100,
  //private key:  f76d6d3d5d64ddc188ae651efd54e6b37267180f35e1e9394705d9ee5bf5cf24
  "0204653774dddff340a80931ff6a4969692782a4ec9c8525c9077105f9063a4e09": 50,
  //private key:  e2e6372707b0660db4bab6fb73c2197f19ff206e08ca690b3cfaf79fae38c065
  "025565f6629be18c32e54c14f1358960d3c518526be6a866bc62c83d5278c4da42": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, isSigned } = req.body;
  console.log(message.privateKey)
  setInitialBalance(message.sender);
  setInitialBalance(message.recipient);

  if (balances[message.sender] < message.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else if (isSigned !== true) {
    res.status(400).send({ message: "Invalid Private Key!" });
  } else {
    balances[message.sender] -= message.amount;
    balances[message.recipient] += message.amount;
    res.send({ balance: balances[message.sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
