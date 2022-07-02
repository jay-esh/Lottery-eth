const { ethers } = require("hardhat")

const modeule = async () => {
    const lottery = await ethers.getContract("Lottery")
    const mock = await ethers.getContract("VRFCoordinatorV2Mock")
    const tx = await lottery.randnumgen()
    let txreciept = await tx.wait(1)
    const reqid = txreciept.events[1].args.requestid.toString()
    // console.log(txreciept.events[1].args)
    const res = await mock.fulfillRandomWords(reqid, lottery.address)
    const reciept = await res.wait(1)
}

const run = async () => {
    modeule().catch((error) => {
        console.log(error)
    })
}
run()
module.exports = { run }
