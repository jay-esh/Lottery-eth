const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("Lottery", () => {
    let lottery, amount, lotteryContract, mock, randomNum, entranceFee

    beforeEach(async () => {
        const { deploy, log } = deployments
        const { deployer } = await getNamedAccounts()
        await deployments.fixture(["all"])
        console.log("here")
        const accounts = await ethers.getSigners()
        const player = accounts[1]
        lotteryContract = await ethers.getContract("Lottery", deployer)
        lottery = await lotteryContract.connect(player)
        mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
        randomNum = await lottery.getrandnum()
        entranceFee = await lottery.getEntranceFee()
    })

    describe("enterRaffle", () => {
        it("checks if the function fails when the amount is less than the entrance fee", async () => {
            amount = ethers.utils.parseEther("0.001")
            await expect(lottery.enterRaffle(amount, 0, { value: entranceFee })).to.be.reverted
        })

        it("checks if the function reverts if the usernumber provided is not b/w 0 and 5 inclusive", async () => {
            amount = ethers.utils.parseEther("0.01")
            await expect(lottery.enterRaffle(amount, 100000, { value: entranceFee })).to.be.reverted
            await expect(lottery.enterRaffle(amount, -6, { value: entranceFee })).to.be.reverted
        })
    })
})
