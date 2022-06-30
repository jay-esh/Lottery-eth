const { developmentChains, network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const baseFee = ethers.utils.parseEther("0.25") //oracle fees for each request from chainlink oracle
    const gasPiceLink = 1e9 //calculated value based on current gas fees
    if (chainId == 31337) {
        log("LocalHost detected deploying mock...")
        //deploy mocks
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [baseFee, gasPiceLink],
        })
        log("Mocks deployed")
        log("----------------------------------------")
    }
}

module.exports.tags = ["all", "lottery"]
