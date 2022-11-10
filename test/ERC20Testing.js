const ERC20 = artifacts.require("ERC20");

contract("ERC20 Testing", (accounts) => {
  let instance = null;
  before(async () => {
    instance = await ERC20.deployed();
  });

  it("Checking for issuerAddress", async () => {
    const issuerAddress = await instance.issuer();
    assert(issuerAddress === accounts[0]);
  });
  it("Checking for registrarAddress", async () => {
    const registrarAddress = await instance.registrar();
    assert(registrarAddress === accounts[1]);
  });

  it("Checking Balance and Contract Balance", async () => {
    const contractBalance = await instance.checkBalance();

    const balanceArray = await instance.checkBalanceforIsuuerorRegisterar(
      accounts[0] // issuer account
    );
    assert(contractBalance.toNumber() === balanceArray.toNumber());
  });

  it("Checking for Contract Paused Status", async () => {
    const status = await instance.isPaused();
    assert(status === true);
  });

  //   it("Transferring Token to another wallet Checking", async () => {
  //     // intially sending allowance to accounts 2 from accounts 0 and sending 100 tokens
  //     const account = await instance.transferFromIssuer(accounts[2], 100);
  //     console.log(account);
  //   });

  it("Checking Intial Issuers Accounts", async () => {
    const issuerAddress = await instance.issuer();
    assert(issuerAddress === accounts[0]);
  });
  it("Checking Intial for registrarAddress", async () => {
    const registrarAddress = await instance.registrar();
    assert(registrarAddress === accounts[1]);
  });
});
