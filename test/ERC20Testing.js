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
});
