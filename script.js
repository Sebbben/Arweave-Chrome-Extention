const walletName = document.getElementById("walletName");
const walletAddr = document.getElementById("walletAddr");
const buyAmount = document.getElementById("buyAmount");
const userBal = document.getElementById("userBal");
const difficulty = document.getElementById("difficulty");
const heightUrl = "https://arweave.net/info";
const amountUrl =
  "https://newapi.bilaxy.com/v1/orderbook?pair=AR_USDT&limit=2000";
var wallets;
var blockHeight;
var resJSON;
var difficuities = [];
var diffDepth = 10;

window.onload = () => {
  diffHistory = localStorage.getObject("diffHistory");
  if (!diffHistory) diffHistory = [];
  initWallets();
  getDiff();
};

function getDiff() {
  var blockInfo = JSON.parse(httpGet(heightUrl));
  blockHeight = blockInfo["height"];
  var blockHash = blockInfo["current"];
  for (i = 0; i < diffDepth; i++) {
    var currentBlock = JSON.parse(
      httpGet(`https://arweave.net/block/hash/${blockHash}`)
    );
    bigDiff = currentBlock["diff"];
    difficuities.push(smallDiffCalc(bigDiff));
    blockHash = currentBlock["previous_block"];
  }
  updateDifficulty();
}

function smallDiffCalc(bigDiff) {
  return Math.ceil(Math.log2(2 ** 256 / (2 ** 256 - Number(bigDiff))));
}

function updateDifficulty() {
  difficulty.innerHTML = "";
  for (i = 0; i < difficuities.length; i++) {
    var li = document.createElement("li");
    li.innerText = difficuities[i];
    difficulty.append(li);
  }
}

function initWallets() {
  wallets = window.localStorage.getObject("wallets");
  if (!wallets) wallets = [];
  resJSON = JSON.parse(httpGet(amountUrl))["bids"];
  for (i = 0; i < resJSON.length; i++) {
    if (resJSON[i][1] >= 500) {
      var row = document.createElement("tr");
      var amount = document.createElement("td");
      amount.innerText = resJSON[i][1];
      var ar = document.createElement("td");
      ar.innerText = resJSON[i][0];
      row.append(amount);
      row.append(ar);
      buyAmount.append(row);
    }
  }
  updateWallets();
}

document.getElementById("addWallet").addEventListener("click", () => {
  wallets.push(new wallet(walletName.value, walletAddr.value));
  localStorage.setObject("wallets", wallets);
  walletName.value = "";
  walletAddr.value = "";
  updateWallets();
});

function updateWallets() {
  userBal.innerHTML = "";
  wallets.forEach(e => {
    e.bal = httpGet(`https://arweave.net/wallet/${e.address}/balance`);
    var row = document.createElement("tr");
    var user = document.createElement("td");
    user.innerText = e.name;
    row.append(user);
    var bal = document.createElement("td");
    bal.innerText = parseFloat(e.bal / 1000000000000).toFixed(2);
    row.append(bal);
    userBal.append(row);
    var delContainer = document.createElement("td");
    var del = document.createElement("button");
    del.innerText = "X";
    del.addEventListener("click", () => {
      deleteThis(e.address);
    });
    delContainer.append(del);
    row.append(delContainer);
    userBal.append(row);
  });
}

function deleteThis(addr) {
  for (i = 0; i < wallets.length; i++) {
    if (addr == wallets[i].address) {
      wallets.splice(i, 1);
      updateWallets();
      localStorage.setObject("wallets", wallets);
      deleteThis(addr);
    }
  }
}

class wallet {
  constructor(name, address) {
    this.address = address;
    this.name = name;
    this.bal;
  }
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function copyXMR() {
  var copyText = document.getElementById("xmr");
  copyText.select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

function copyAR() {
  var copyText = document.getElementById("ar");
  copyText.select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}
