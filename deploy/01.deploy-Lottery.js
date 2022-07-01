const { developmentChains, network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId
    const subfunamount = ethers.utils.parseEther("30")

    if (chainId == 31337) {
        const vrfCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock")

        vrfCoordinatorV2Address = vrfCoordinatorV2.address
        const transactionResponse = await vrfCoordinatorV2.createSubscription()

        const transactionReciept = await transactionResponse.wait(1)

        subscriptionId = transactionReciept.events[0].args.subId

        // fund the subscription
        await vrfCoordinatorV2.fundSubscription(subscriptionId, subfunamount)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinator"]
        subscriptionId = "7165"
    }

    let args = [
        vrfCoordinatorV2Address,
        networkConfig[chainId]["entranceFee"],
        networkConfig[chainId]["gasLane"],
        subscriptionId,
        networkConfig[chainId]["callbackGasLimit"],
    ]

    const lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    //     console.log("verifying")
    //     await verify(lottery.address, args)
    // }

    log("------------------------------------------")
}

module.exports.tags = ["all", "lottery"]
