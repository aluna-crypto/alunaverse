const { expect, assert } = require("chai");
const { formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Alunaverse contract", function () {
  let AlunaverseFactory;
  let AlunaverseContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  var supplyLimits = [10000, 5000, 7000, 1234];
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
  }

  before(initialSetup);

  describe("Deployment", function () {
    before(deployContract);

    it("Should set the right owner", async function () {
      expect(await AlunaverseContract.owner()).to.equal(owner.address);
    });

    it("Should begin with no tokens active", async function () {
      expect(await AlunaverseContract.tokenActive(0)).to.equal(false);
      expect(await AlunaverseContract.tokenActive(1)).to.equal(false);
      expect(await AlunaverseContract.tokenActive(2)).to.equal(false);
      expect(await AlunaverseContract.tokenActive(3)).to.equal(false);
    });

    it("Should begin with all supply limits at 0", async function () {
      expect(await AlunaverseContract.tokenSupplyLimit(0)).to.equal(0);
      expect(await AlunaverseContract.tokenSupplyLimit(1)).to.equal(0);
      expect(await AlunaverseContract.tokenSupplyLimit(2)).to.equal(0);
      expect(await AlunaverseContract.tokenSupplyLimit(3)).to.equal(0);
    });

    it("Should begin with all supply at 0", async function () {
      expect(await AlunaverseContract.tokenTotalSupply(0)).to.equal(0);
      expect(await AlunaverseContract.tokenTotalSupply(1)).to.equal(0);
      expect(await AlunaverseContract.tokenTotalSupply(2)).to.equal(0);
      expect(await AlunaverseContract.tokenTotalSupply(3)).to.equal(0);
    });
  });

  describe("Changing settings", function () {
    beforeEach(deployContract);

    it("Should allow contract owner to initialise token", async function () {
      await AlunaverseContract.connect(owner).initialiseToken(2, supplyLimits[1], tokenUris[1]);

      expect(await AlunaverseContract.connect(owner).tokenActive(2)).to.equal(true);
      expect(await AlunaverseContract.connect(owner).tokenSupplyLimit(2)).to.equal(supplyLimits[1]);
      expect(await AlunaverseContract.connect(owner).uri(2)).to.equal(tokenUris[1]);
    });

    it("Should fail if others try to initialise token", async function () {
      await expect(AlunaverseContract.connect(addr1).initialiseToken(2, supplyLimits[1], tokenUris[1])).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow contract owner to toggle token active state", async function () {
      await AlunaverseContract.connect(owner).toggleTokenActive(2);
      expect(await AlunaverseContract.connect(owner).tokenActive(2)).to.equal(true);

      await AlunaverseContract.connect(owner).toggleTokenActive(2);
      expect(await AlunaverseContract.connect(owner).tokenActive(2)).to.equal(false);
    });

    it("Should fail if others try to toggle token active state", async function () {
      await expect(AlunaverseContract.connect(addr1).toggleTokenActive(2)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow contract owner to set token uri", async function () {
      await AlunaverseContract.connect(owner).updateTokenUri(1, tokenUris[0]);

      expect(await AlunaverseContract.connect(owner).uri(1)).to.equal(tokenUris[0]);
    });

    it("Should fail if others try to set token uri", async function () {
      await expect(AlunaverseContract.connect(addr1).updateTokenUri(1, tokenUris[0])).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow contract owner to set token supply", async function () {
      await AlunaverseContract.connect(owner).updateTokenSupplyLimit(1, supplyLimits[0]);

      expect(await AlunaverseContract.connect(owner).tokenSupplyLimit(1)).to.equal(supplyLimits[0]);
    });

    it("Should fail if others try to set token supply", async function () {
      await expect(AlunaverseContract.connect(addr1).updateTokenSupplyLimit(1, supplyLimits[0])).to.be.revertedWith("Ownable: caller is not the owner");
    });
    
    it("Should allow contract owner to approve/revoke addresses for minting", async function () {
      expect(await AlunaverseContract.approvedMinters(addr1.address)).to.equal(false);

      await AlunaverseContract.connect(owner).approveMinter(addr1.address);

      expect(await AlunaverseContract.approvedMinters(addr1.address)).to.equal(true);

      await AlunaverseContract.connect(owner).revokeMinter(addr1.address);

      expect(await AlunaverseContract.approvedMinters(addr1.address)).to.equal(false);
    });

    it("Should fail if others try to approve/revoke addresses for minting", async function () {
      await expect(AlunaverseContract.connect(addr1).approveMinter(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
      await expect(AlunaverseContract.connect(addr1).revokeMinter(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to change the royalties", async function () {
      let royaltyInfo = await AlunaverseContract.royaltyInfo(1, 100);

      expect(royaltyInfo[0]).to.equal(owner.address);
      expect(royaltyInfo[1]).to.equal(ethers.BigNumber.from("50").div(10));

      await AlunaverseContract.connect(owner).setRoyalties(addr1.address, 1000);

      royaltyInfo = await AlunaverseContract.royaltyInfo(1, 100);
      expect(royaltyInfo[0]).to.equal(addr1.address);
      expect(royaltyInfo[1]).to.equal(ethers.BigNumber.from("10"));
    });

    it("Should not allow any others to change the royalties", async function () {
      expect(AlunaverseContract.connect(addr1).setRoyalties(addr1.address, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Minting tokens", function () {
    beforeEach(deployContract);
    beforeEach(async function () {
      await AlunaverseContract.connect(owner).initialiseToken(1, supplyLimits[0], tokenUris[0]);
      await AlunaverseContract.connect(owner).initialiseToken(2, supplyLimits[1], tokenUris[1]);
      await AlunaverseContract.connect(owner).initialiseToken(3, supplyLimits[2], tokenUris[2]);
      await AlunaverseContract.connect(owner).initialiseToken(4, supplyLimits[3], tokenUris[3]);

      await AlunaverseContract.connect(owner).approveMinter(addr1.address);
      await AlunaverseContract.connect(owner).approveMinter(addr2.address);
    });

    it("Should only allow the owner or approved addresses to mint tokens", async function () {
      await AlunaverseContract.connect(owner).mint(addrs[0].address, 1, 1);
      await AlunaverseContract.connect(addr1).mint(addr1.address, 3, 1);
      await AlunaverseContract.connect(addr2).mint(addr1.address, 2, 1);

      expect(await AlunaverseContract.connect(owner).totalSupply(1)).to.equal(1);
      expect(await AlunaverseContract.connect(owner).totalSupply(2)).to.equal(1);
      expect(await AlunaverseContract.connect(owner).totalSupply(3)).to.equal(1);

      await expect(AlunaverseContract.connect(addrs[0]).mint(addr1.address, 2, 1)).to.be.revertedWith("UNAUTHORIZED_MINTER");
      await expect(AlunaverseContract.connect(addrs[1]).mint(addr1.address, 2, 1)).to.be.revertedWith("UNAUTHORIZED_MINTER");
    });

    it("Should fail if token is not active", async function () {
      await expect(AlunaverseContract.connect(addr1).mint(addr1.address, 5, 1)).to.be.revertedWith("TOKEN_NOT_ACTIVE");
      await AlunaverseContract.connect(owner).toggleTokenActive(3);
      await expect(AlunaverseContract.connect(addr2).mint(addr2.address, 3, 2)).to.be.revertedWith("TOKEN_NOT_ACTIVE");
    });

    it("Should allow minting tokens up to the supply limit", async function () {
      this.timeout(0);
      for (let i = 0; i < supplyLimits[1]; i += 100) {
        await AlunaverseContract.connect(addr1).mint(addr1.address, 2, 100);
      }

      expect(await AlunaverseContract.connect(owner).totalSupply(2)).to.equal(supplyLimits[1]);

      await expect(AlunaverseContract.connect(addr1).mint(addr1.address, 2, 1)).to.be.revertedWith("OUT_OF_SUPPLY");
    });

    it("Should allow minting any quantity into any address", async function () {
      await AlunaverseContract.connect(addr1).mint(addr1.address, 2, 100);

      expect(await AlunaverseContract.balanceOf(addr1.address, 2)).to.equal(100);

      await AlunaverseContract.connect(addr1).mint(addrs[3].address, 2, 56);

      expect(await AlunaverseContract.balanceOf(addrs[3].address, 2)).to.equal(56);
    });
  });

  describe("Minting tokens in batch", function () {
    beforeEach(deployContract);
    beforeEach(async function () {
      await AlunaverseContract.connect(owner).initialiseToken(1, supplyLimits[0], tokenUris[0]);
      await AlunaverseContract.connect(owner).initialiseToken(2, supplyLimits[1], tokenUris[1]);
      await AlunaverseContract.connect(owner).initialiseToken(3, supplyLimits[2], tokenUris[2]);
      await AlunaverseContract.connect(owner).initialiseToken(4, supplyLimits[3], tokenUris[3]);

      await AlunaverseContract.connect(owner).approveMinter(addr1.address);
      await AlunaverseContract.connect(owner).approveMinter(addr2.address);
    });

    it("Should only allow the owner or approved addresses to mint tokens", async function () {
      await AlunaverseContract.connect(owner).mintBatch(addrs[0].address, [1,2], [1,1]);
      await AlunaverseContract.connect(addr1).mintBatch(addr1.address, [1,2,3], [2,4,4]);
      await AlunaverseContract.connect(addr2).mintBatch(addr1.address, [2,4], [5,1]);

      expect(await AlunaverseContract.connect(owner).totalSupply(1)).to.equal(3);
      expect(await AlunaverseContract.connect(owner).totalSupply(2)).to.equal(10);
      expect(await AlunaverseContract.connect(owner).totalSupply(3)).to.equal(4);
      expect(await AlunaverseContract.connect(owner).totalSupply(4)).to.equal(1);

      await expect(AlunaverseContract.connect(addrs[0]).mintBatch(addr1.address, [1,2], [1,1])).to.be.revertedWith("UNAUTHORIZED_MINTER");
      await expect(AlunaverseContract.connect(addrs[1]).mintBatch(addr1.address, [1,2], [1,1])).to.be.revertedWith("UNAUTHORIZED_MINTER");
    });

    it("Should fail if token is not active", async function () {
      await expect(AlunaverseContract.connect(addr1).mintBatch(addr1.address, [5,6], [1,1])).to.be.revertedWith("TOKEN_NOT_ACTIVE");
      await AlunaverseContract.connect(owner).toggleTokenActive(3);
      await expect(AlunaverseContract.connect(addr2).mintBatch(addr2.address, [3,1], [2,3])).to.be.revertedWith("TOKEN_NOT_ACTIVE");
      await expect(AlunaverseContract.connect(addr1).mintBatch(addr1.address, [7,1], [1,1])).to.be.revertedWith("TOKEN_NOT_ACTIVE");
    });

    it("Should allow minting tokens up to the supply limit", async function () {
      this.timeout(0);
      for (let i = 0; i < supplyLimits[1]; i += 100) {
        await AlunaverseContract.connect(addr1).mintBatch(addr1.address, [1,2], [100,100]);
      }

      expect(await AlunaverseContract.connect(owner).totalSupply(2)).to.equal(supplyLimits[1]);
      expect(await AlunaverseContract.connect(owner).totalSupply(1)).to.equal(supplyLimits[1]);

      await expect(AlunaverseContract.connect(addr1).mintBatch(addr1.address, [1,2], [1,1])).to.be.revertedWith("OUT_OF_SUPPLY");
    });

    it("Should allow minting any quantity into any address", async function () {
      await AlunaverseContract.connect(addr1).mintBatch(addr1.address, [1,2,4], [50,20,15]);

      expect(await AlunaverseContract.balanceOf(addr1.address, 1)).to.equal(50);
      expect(await AlunaverseContract.balanceOf(addr1.address, 2)).to.equal(20);
      expect(await AlunaverseContract.balanceOf(addr1.address, 3)).to.equal(0);
      expect(await AlunaverseContract.balanceOf(addr1.address, 4)).to.equal(15);

      await AlunaverseContract.connect(addr1).mintBatch(addrs[3].address, [2,3], [33,56]);

      expect(await AlunaverseContract.balanceOf(addrs[3].address, 1)).to.equal(0);
      expect(await AlunaverseContract.balanceOf(addrs[3].address, 2)).to.equal(33);
      expect(await AlunaverseContract.balanceOf(addrs[3].address, 3)).to.equal(56);
      expect(await AlunaverseContract.balanceOf(addrs[3].address, 4)).to.equal(0);
    });
  });
});
