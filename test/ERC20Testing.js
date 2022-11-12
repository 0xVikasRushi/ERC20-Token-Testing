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

  let contractBalance;
  it("Checking Balance and Contract Balance", async () => {
    contractBalance = await instance.checkBalance();

    const balanceArray = await instance.checkBalanceforIsuuerorRegisterar(
      accounts[0] // issuer account
    );
    assert(contractBalance.toNumber() === balanceArray.toNumber());
  });

  let statusIspaused;
  it("Checking for Contract Paused Status", async () => {
    statusIspaused = await instance.isPaused();
    assert(statusIspaused === true);
  });

  it("Checking WhiteListing Accounts", async () => {
    const issuerAddress = await instance.issuer();
    // here issuer can't use their wallet to send money
    assert(issuerAddress != accounts[2]);
    // Checking for new account is WhiteListed default it should be false
    const intialStatus = await instance.isWhitelisted(accounts[2]);
    assert(intialStatus == false);
    const WhiteListingAccount = await instance.addToWhitelist(accounts[2]);
    const statusforWhiteListing = WhiteListingAccount.receipt.status;
    const FinalStatus = await instance.isWhitelisted(accounts[2]);
    assert(FinalStatus === statusforWhiteListing);
  });

  it("Checking changing paused true to false ", async () => {
    const unpauseContract = await instance.unpauseContract();
    assert(unpauseContract.receipt.status === true);
    statusIspaused = await instance.isPaused();
    assert(statusIspaused === false);
  });

  const amount = 1000;
  it("Check Transferring Token from Issuer ", async () => {
    const transferringToken = await instance.transferFromIssuer(
      accounts[2],
      amount
    );
    assert(transferringToken.receipt.status === true);
  });

  it("Checking Balance of Issuer ", async () => {
    const IssuerSupply = await instance.checkBalanceforIsuuerorRegisterar(
      accounts[0]
    );
    assert(IssuerSupply.toNumber() + amount == contractBalance.toNumber());
  });
});


