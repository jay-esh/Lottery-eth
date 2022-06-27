const { developmentChains, network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // const entranceFee = networkConfig[chainId]["entranceFee"]
    let vrfCoordinatorV2Address

    if (chainId == 31337) {
        const vrfCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock")
        // console.log(vrfCoordinatorV2)
        vrfCoordinatorV2Address = vrfCoordinatorV2.address
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinator"]
    }

    let args = [
        vrfCoordinatorV2Address,
        ethers.utils.parseEther("0.01"),
        "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        "7165",
        "500000",
    ]

    const lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
        console.log("verifying")
        await verify(lottery.address, args)
    }

    log("------------------------------------------")
}

// module.exports.tags = ["rinkeby", "lottery"]
