const { expect } = require("chai")
const { BigNumber } = require("ethers")
const { ethers } = require("hardhat")

const mockvrf = async () => {
    // const lottery = await ethers.getContract("Lottery")
    // const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
    // console.log(checkData)
    // // const { upkeepNeeded } = await lottery.callStatic.checkUpKeep.checkData
    // // console.log(upkeepNeeded)
    // const mock = await ethers.getContract("VRFCoordinatorV2Mock")
    // const address = mock.address
    // // const requestId = tx.events[1].args.requestId
    // const requestid = await lottery.getrandnum()
    // console.log(requestid)
    const lot = await ethers.getContract("Lottery")
    console.log(lot)
    let tx = await lot.requestRandom()
    // console.log(await tx.blockNumber)
    let { events } = await tx.wait()
    // const txReceipt = await tx.wait(1)
    // const requestId = txReceipt.events[1].args.requestId
    console.log(events)
}

mockvrf().catch((error) => {
    console.log(error)
})
