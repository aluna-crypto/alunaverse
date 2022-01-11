const { expect, assert } = require("chai");
const { formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("AlunaverseMinter contract", function () {
  let AlunaverseFactory;
  let AlunaverseContract;
  let AlunaverseMinterFactory;
  let AlunaverseMinterContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  var supplyLimits = [10000, 5000, 7000, 1234];
  var mintPrices = [
    ethers.utils.parseEther("0.05"), 
    ethers.utils.parseEther("0.07"), 
    ethers.utils.parseEther("0.1"), 
    ethers.utils.parseEther("0.03")
  ];
  var tokenUris = [
    "http://url.com/api/1",
    "http://url.com/api/2",
    "http://url.com/api/3",
    "http://url.com/api/4",
  ];

  const initialSetup = async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  }

  const deployContract = async () => {
    AlunaverseFactory = await ethers.getContractFactory("Alunaverse");

    AlunaverseContract = await AlunaverseFactory.deploy();

    await AlunaverseContract.deployed();

    AlunaverseMinterFactory = await ethers.getContractFactory("AlunaverseMinter");

    AlunaverseMinterContract = await AlunaverseMinterFactory.deploy(
      AlunaverseContract.address
    );

    await AlunaverseMinterContract.deployed();

    await AlunaverseMinterContract.updateWithdrawalAddress(addrs[9].address);
  }

  const setupTokens = async () => {
    await AlunaverseContract.connect(owner).initialiseToken(1, supplyLimits[0], tokenUris[0]);
    await AlunaverseContract.connect(owner).initialiseToken(2, supplyLimits[1], tokenUris[1]);
    await AlunaverseContract.connect(owner).initialiseToken(3, supplyLimits[2], tokenUris[2]);
    await AlunaverseContract.connect(owner).initialiseToken(4, supplyLimits[3], tokenUris[3]);

    
    await AlunaverseMinterContract.connect(owner).updateTokenMintPrice(1, mintPrices[0]);
    await AlunaverseMinterContract.connect(owner).updateTokenMintPrice(2, mintPrices[1]);
    await AlunaverseMinterContract.connect(owner).updateTokenMintPrice(3, mintPrices[2]);
    await AlunaverseMinterContract.connect(owner).updateTokenMintPrice(4, mintPrices[3]);

    await AlunaverseContract.approveMinter(AlunaverseMinterContract.address);
  }

  const setupWhitelistData = async function () {
    await AlunaverseMinterContract.connect(owner).updateWhitelistSigner(await owner.getAddress());

    domain = {
      name:"AlunaverseMinter",
      version:"1",
      chainId:1337,
      verifyingContract:AlunaverseMinterContract.address
    };
       
    types = {
      whitelistMint:[
        {name:"buyer",type:"address"},
        {name:"tokenId",type:"uint256"},
        {name:"limit",type:"uint256"}
      ],
    };

    let buyerAddr1 = ethers.utils.getAddress(addr1.address);
    let buyerAddr2 = ethers.utils.getAddress(addr2.address);

    value1 = {
      buyer:buyerAddr1,
      tokenId:1,
      limit:3
    };

    value2 = {
      buyer:buyerAddr2,
      tokenId:2,
      limit:7
    };
  }

  before(initialSetup);

  describe("Deployment", function () {
    before(deployContract);

    it("Should set the right owner", async function () {
      expect(await AlunaverseMinterContract.owner()).to.equal(owner.address);
    });

    it("Should begin with public sale disabled", async function () {
      expect(await AlunaverseMinterContract.tokenPublicSaleEnabled(0)).to.equal(false);
      expect(await AlunaverseMinterContract.tokenPublicSaleEnabled(1)).to.equal(false);
      expect(await AlunaverseMinterContract.tokenPublicSaleEnabled(2)).to.equal(false);
      expect(await AlunaverseMinterContract.tokenPublicSaleEnabled(3)).to.equal(false);
    });

    it("Should begin with all mint price at 0", async function () {
      expect(await AlunaverseMinterContract.tokenMintPrice(0)).to.equal(0);
      expect(await AlunaverseMinterContract.tokenMintPrice(1)).to.equal(0);
      expect(await AlunaverseMinterContract.tokenMintPrice(2)).to.equal(0);
      expect(await AlunaverseMinterContract.tokenMintPrice(3)).to.equal(0);
    });
  });

  describe("Changing settings", function () {
    beforeEach(deployContract);

    it("Should allow owner to set whitelist signer", async function () {
      await AlunaverseMinterContract.connect(owner).updateWhitelistSigner(addr1.address);

      expect(await AlunaverseMinterContract.whitelistSigner()).to.equal(addr1.address);
    });

    it("Should not allow any others to set whitelist signer", async function () {
      expect(AlunaverseMinterContract.connect(addr1).updateWhitelistSigner(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow contract owner to toggle public sale", async function () {
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(2);
      expect(await AlunaverseMinterContract.connect(owner).tokenPublicSaleEnabled(2)).to.equal(true);

      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(2);
      expect(await AlunaverseMinterContract.connect(owner).tokenPublicSaleEnabled(2)).to.equal(false);
    });

    it("Should fail if others try to toggle public sale", async function () {
      await expect(AlunaverseMinterContract.connect(addr1).toggleTokenPublicSale(2)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow contract owner to set mint price", async function () {
      await AlunaverseMinterContract.connect(owner).updateTokenMintPrice(1, mintPrices[0]);

      expect(await AlunaverseMinterContract.connect(owner).tokenMintPrice(1)).to.equal(mintPrices[0]);
    });

    it("Should fail if others try to set mint price", async function () {
      await expect(AlunaverseMinterContract.connect(addr1).updateTokenMintPrice(1, mintPrices[0])).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set withdrawal address", async function () {
      await AlunaverseMinterContract.connect(owner).updateWithdrawalAddress(addr2.address);

      expect(await AlunaverseMinterContract.withdrawalAddress()).to.equal(addr2.address);
    });

    it("Should not allow any others to set withdrawal address", async function () {
      expect(AlunaverseMinterContract.connect(addr1).updateWithdrawalAddress(addr2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Sale progression", function () {
    beforeEach(deployContract);
    beforeEach(setupTokens);
    beforeEach(setupWhitelistData);

    it("Should allow whitelisted wallet to mint", async function () {
      let signature1 = await owner._signTypedData(domain, types, value1);
      let signature2 = await owner._signTypedData(domain, types, value2);
      
      await AlunaverseMinterContract.connect(addr1).whitelistMint(signature1, 1, 3, 3, {value: mintPrices[0].mul(3)});
      await AlunaverseMinterContract.connect(addr2).whitelistMint(signature2, 2, 4, 7, {value: mintPrices[1].mul(4)});

      expect(await AlunaverseContract.balanceOf(addr1.address, 1)).to.equal(3);
      expect(await AlunaverseContract.balanceOf(addr2.address, 2)).to.equal(4);
    });

    it("Should fail to allow more than approved limit of mints per wallet", async function () {
      let signature1 = await owner._signTypedData(domain, types, value1);
      let signature2 = await owner._signTypedData(domain, types, value2);

      await AlunaverseMinterContract.connect(addr1).whitelistMint(signature1, 1, 3, 3, {value: mintPrices[0].mul(3)})
      await AlunaverseMinterContract.connect(addr2).whitelistMint(signature2, 2, 7, 7, {value: mintPrices[1].mul(7)})

      await expect(AlunaverseMinterContract.connect(addr1).whitelistMint(signature1, 1, 1, 3, {value: mintPrices[0]})).to.be.revertedWith("WALLET_LIMIT_EXCEEDED");
      await expect(AlunaverseMinterContract.connect(addr2).whitelistMint(signature2, 2, 1, 7, {value: mintPrices[1]})).to.be.revertedWith("WALLET_LIMIT_EXCEEDED");
    });

    it("Should fail if whitelist signature produced by someone other than specified signer or value different", async function () {
      let signature = await addr2._signTypedData(domain, types, value1);

      expect(AlunaverseMinterContract.connect(addr1).whitelistMint(signature, 1, 3, 3, {value: mintPrices[0].mul(3)})).to.be.revertedWith("INVALID_SIGNATURE");
      expect(AlunaverseMinterContract.connect(addr2).whitelistMint(signature, 1, 3, 3, {value: mintPrices[0].mul(3)})).to.be.revertedWith("INVALID_SIGNATURE");
      
      let signature2 = await owner._signTypedData(domain, types, value2);
      expect(AlunaverseMinterContract.connect(addr1).whitelistMint(signature2, 1, 7, 7, {value: mintPrices[0].mul(7)})).to.be.revertedWith("INVALID_SIGNATURE");
      expect(AlunaverseMinterContract.connect(owner).whitelistMint(signature2, 1, 7, 7, {value: mintPrices[0].mul(7)})).to.be.revertedWith("INVALID_SIGNATURE");
    });

    it("Should require right mint price per token for whitelist minting", async function () {
      let signature1 = await owner._signTypedData(domain, types, value1);
      let signature2 = await owner._signTypedData(domain, types, value2);

      await expect(AlunaverseMinterContract.connect(addr1).whitelistMint(signature1, 1, 1, 3, {value: mintPrices[0].sub(1)})).to.be.revertedWith("INCORRECT_PAYMENT");
      expect(await AlunaverseContract.connect(owner).tokenTotalSupply(1)).to.equal(0);

      await expect(AlunaverseMinterContract.connect(addr2).whitelistMint(signature2, 2, 1, 7, {value: mintPrices[1].sub(1)})).to.be.revertedWith("INCORRECT_PAYMENT");
      expect(await AlunaverseContract.connect(owner).tokenTotalSupply(2)).to.equal(0);


      await AlunaverseMinterContract.connect(addr2).whitelistMint(signature2, 2, 1, 7, {value: mintPrices[1]});
      expect(await AlunaverseContract.connect(owner).tokenTotalSupply(2)).to.equal(1);

      await AlunaverseMinterContract.connect(addr1).whitelistMint(signature1, 1, 3, 3, {value: mintPrices[0].mul(3)});
      expect(await AlunaverseContract.connect(owner).tokenTotalSupply(1)).to.equal(3);
    });

    it("Should fail to allow public mint if not enabled", async function () {
      await expect(AlunaverseMinterContract.connect(addr1).publicMint(1, 1, {value: mintPrices[0]})).to.be.revertedWith("PUBLIC_SALE_DISABLED");
    });

    it("Should allow any wallet to mint if public sale is enabled", async function () {
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(1);
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(2);
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(3);
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(4);

      await AlunaverseMinterContract.connect(addr1).publicMint(1, 1, {value: mintPrices[0]});
      await AlunaverseMinterContract.connect(addr2).publicMint(2, 3, {value: mintPrices[1].mul(3)});
      await AlunaverseMinterContract.connect(addrs[0]).publicMint(3, 5, {value: mintPrices[2].mul(5)});
      await AlunaverseMinterContract.connect(addrs[4]).publicMint(4, 11, {value: mintPrices[3].mul(11)});

      expect(await AlunaverseContract.balanceOf(addrs[0].address, 3)).to.equal(5);
      expect(await AlunaverseContract.balanceOf(addrs[0].address, 4)).to.equal(0);
      expect(await AlunaverseContract.tokenTotalSupply(1)).to.equal(1);
      expect(await AlunaverseContract.tokenTotalSupply(2)).to.equal(3);
      expect(await AlunaverseContract.tokenTotalSupply(3)).to.equal(5);
      expect(await AlunaverseContract.tokenTotalSupply(4)).to.equal(11);
    });

    it("Should allow public sale minting up to the max supply limit", async function () {
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(1);
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(2);

      this.timeout(0);

      for (let i = 0; i < supplyLimits[1]; i += 100) {
        await AlunaverseMinterContract.connect(addr1).publicMint(2, 100, {value: mintPrices[1].mul(100)});
        await AlunaverseMinterContract.connect(addr2).publicMint(1, 100, {value: mintPrices[0].mul(100)});
      }

      await expect(AlunaverseMinterContract.connect(addr2).publicMint(2, 1, {value: mintPrices[1]})).to.be.revertedWith('OUT_OF_SUPPLY');

      await AlunaverseMinterContract.connect(addr1).publicMint(1, 100, {value: mintPrices[0].mul(100)});

      expect(await AlunaverseContract.connect(owner).tokenTotalSupply(2)).to.equal(supplyLimits[1]);
    });
  });

  describe("Withdrawing funds", function () {
    beforeEach(deployContract);
    beforeEach(setupTokens);

    it("Should allow the contract owner to withdraw the entire balance in the contract", async function () {
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(2);
      await AlunaverseMinterContract.connect(owner).toggleTokenPublicSale(3);

      await AlunaverseMinterContract.connect(addr1).publicMint(2, 5, {value: mintPrices[1].mul(5)});
      await AlunaverseMinterContract.connect(addr2).publicMint(3, 5, {value: mintPrices[2].mul(5)});

      let expectedBalance = mintPrices[1].mul(5).add(mintPrices[2].mul(5));

      expect(await ethers.provider.getBalance(AlunaverseMinterContract.address)).to.equal(expectedBalance)

      await expect(await AlunaverseMinterContract.connect(owner).withdraw())
        .to.changeEtherBalances(
          [
            owner,
            addrs[9],
            AlunaverseMinterContract
          ],
          [
            0,
            expectedBalance,
            ethers.constants.NegativeOne.mul(expectedBalance)
          ]);
    });

    it("Should fail if there is 0 balance in the contract", async function () {
      await expect(AlunaverseMinterContract.connect(owner).withdraw()).to.be.revertedWith("ZERO_BALANCE")
    });

    it("Should fail if anyone other than the owner tries to withdraw", async function () {
      await expect(AlunaverseMinterContract.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
      await expect(AlunaverseMinterContract.connect(addr2).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
    });
  });
});
