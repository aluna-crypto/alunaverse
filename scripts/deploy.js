// This is a script for deploying your contracts. You can adapt it to deploy

const { network } = require("hardhat");

// yours, or create new ones.
async function main() {
    // This is just a convenience check
    if (network.name === "hardhat") {
      console.warn(
        "You are trying to deploy a contract to the Hardhat Network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }
  
    // ethers is available in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const AlunaverseContract = await (await (await ethers.getContractFactory("Alunaverse")).deploy()).deployed();

    console.log("Alunaverse contract address:", AlunaverseContract.address);
  
    const AlunaverseMinterContract = await (await (await ethers.getContractFactory("AlunaverseMinter")).deploy(
      AlunaverseContract.address
    )).deployed();

    console.log("Alunaverse Minter contract address:", AlunaverseMinterContract.address);

    await AlunaverseContract.connect(deployer).approveMinter(AlunaverseMinterContract.address);
    
    // We also save the contract's artifacts and address in the frontend directory
    saveFrontendFiles(AlunaverseContract, AlunaverseMinterContract);
  }
  
  function saveFrontendFiles(AlunaverseContract, AlunaverseMinterContract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../client/contracts";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    var contractAddressesJson = fs.readFileSync(
      contractsDir + "/contract-address.json",
      { flag: "a+" }
    );

    contractAddresses = contractAddressesJson.length == 0 ? {} : JSON.parse(contractAddressesJson);

    contractAddresses[network.name] = {
      Alunaverse: AlunaverseContract.address,
      AlunaverseMinter: AlunaverseMinterContract.address
    }
    
    fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify(contractAddresses, undefined, 2)
    );
  
    const AlunaverseArtifact = artifacts.readArtifactSync("Alunaverse");
  
    fs.writeFileSync(
      contractsDir + "/Alunaverse.json",
      JSON.stringify(AlunaverseArtifact, null, 2)
    );
  
    const AlunaverseMinterArtifact = artifacts.readArtifactSync("AlunaverseMinter");
  
    fs.writeFileSync(
      contractsDir + "/AlunaverseMinter.json",
      JSON.stringify(AlunaverseMinterArtifact, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  