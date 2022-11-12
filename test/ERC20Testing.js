const ERC20 = artifacts.require("ERC20");

contract("ERC20 Testing", (accounts) => {
  let instance = null;
  before(async () => {
    instance = await ERC20.deployed();
  });

  it("Checking for Token Basic Info", async () => {
    const name = await instance.name();
    const info = await instance.asset();
    const Supply = await instance.totalSupply();
    const decimals = await instance.decimals();
    assert(name === "HDA Token");
    assert(info === "Reals Estate");
    assert(Supply.toNumber() === 400000);
    assert(decimals.toNumber() === 18);
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

  // here accounts[2] are users
  let FinalStatus;
  it("Checking WhiteListing Accounts", async () => {
    const issuerAddress = await instance.issuer();
    // here issuer can't use their wallet to send money
    assert(issuerAddress != accounts[2]);
    // Checking for new account is WhiteListed default it should be false
    const intialStatus = await instance.isWhitelisted(accounts[2]);
    assert(intialStatus == false);
    const WhiteListingAccount = await instance.addToWhitelist(accounts[2]);
    const statusforWhiteListing = WhiteListingAccount.receipt.status;
    FinalStatus = await instance.isWhitelisted(accounts[2]);
    assert(FinalStatus === statusforWhiteListing);
  });

  it("Checking changing paused true to false ", async () => {
    const unpauseContract = await instance.unpauseContract();
    assert(unpauseContract.receipt.status === true);
    statusIspaused = await instance.isPaused();
    assert(statusIspaused === false);
  });

  const amount = 100;
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

  const extraTokenSupply = 100;
  let newTotalSupply;

  it("Checking Miniting Token", async () => {
    const BeforeMintSupply = await instance.totalSupply();
    const mintStatus = await instance.mint(extraTokenSupply);
    assert(mintStatus.receipt.status === true);

    newTotalSupply = await instance.totalSupply();
    assert(
      BeforeMintSupply.toNumber() + extraTokenSupply ===
        newTotalSupply.toNumber()
    );
  });

  it("Checking Burn Token", async () => {
    const burnStatus = await instance.burn(extraTokenSupply);
    assert(burnStatus.receipt.status === true);

    const afterBurnSupply = await instance.totalSupply();
    assert(
      afterBurnSupply.toNumber() ===
        newTotalSupply.toNumber() - extraTokenSupply
    );
  });

  it("Checking Removing Accounts from WhiteList", async () => {
    const statusForRemoval = await instance.removeFromWhitelist(accounts[2]);
    const isWhitelisted = await instance.isWhitelisted(accounts[2]);
    assert(!isWhitelisted === statusForRemoval.receipt.status);
  });
});
