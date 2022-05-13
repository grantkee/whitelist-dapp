const { ethers } = require("hardhat");

async function main() {
    const whitlistedContract = await ethers.getContractFactory("Whitelist");

    // deploy contract - define max number of whitelisted contracts
    const deployedWhitelistContract = await whitlistedContract.deploy(10);

    // wait for contract to finish deploying
    await deployedWhitelistContract.deployed();

    // print address of deployed contract
    console.log(
        "Whitelist Contract Address:",
        deployedWhitelistContract.address
    );
}

// call main function and catch any errors
main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });

