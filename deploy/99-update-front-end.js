const fs = require("fs")
const { ethers } = require("hardhat")

const contractaddressfilepath = "../lotteryfrontend/constants/contractAddress.json"
const contractabifilepath = "../lotteryfrontend/constants/abi.json"
module.exports = async function () {
    console.log("updating contract address...")
    // const contractaddrs = fs.readFileSync(contractaddressfilepath, "utf8")
    // console.log(contractaddressfilepath)
    await updateContractAddress()
    await updatecontractabi()
}

const updateContractAddress = async () => {
    const chainId = await network.config.chainId.toString()
    const lottery = await ethers.getContract("Lottery")
    console.log(chainId)
    const contractaddrs = JSON.parse(fs.readFileSync(contractaddressfilepath, "utf8"))
    if (chainId in contractaddrs) {
        // console.log("here")
        if (!contractaddrs[chainId].includes(lottery.address)) {
            contractaddrs[chainId].push(lottery.address)
        }
    } else {
        contractaddrs[chainId] = lottery.address
    }
    fs.writeFileSync(contractaddressfilepath, JSON.stringify(contractaddrs))
}

const updatecontractabi = async () => {
    const contract = await ethers.getContract("Lottery")
    const abi = contract.interface.format(ethers.utils.FormatTypes.json)
    fs.writeFileSync(contractabifilepath, abi)
}
module.exports.tag = ["all", "update"]
