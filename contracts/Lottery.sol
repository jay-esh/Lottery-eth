// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

error RaffleError();

contract Lottery is VRFConsumerBaseV2 {
    event Random(uint256 indexed id, uint256 indexed randomnumber, address from);

    uint256 private immutable i_entranceFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant requestConfirmations = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant numWords = 1;
    uint256 public randomnum;
    address public player;
    uint256 public playerNum;
    bool public winnerOrNot;
    uint256 public gambelledamount;

    constructor(
        address vrfCoordinator,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function enterRaffle(uint256 amount, uint256 num) public payable {
        if (msg.value < i_entranceFee) {
            revert RaffleError();
        } else {
            player = msg.sender;
            playerNum = num;
            if (msg.value == amount) {
                gambelledamount = amount;
            } else {
                revert RaffleError();
            }
        }
    }

    function requestRandom() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            requestConfirmations,
            i_callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(
        uint256, /*requestId*/
        uint256[] memory randomWords
    ) internal override {
        randomnum = randomWords[0] % 6;
        winnerOrNot = (randomnum == playerNum);
        emit Random(0, randomnum, player);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getAmountsentByUser() public view returns (uint256) {
        return gambelledamount;
    }

    function randnumgen() public returns (uint256) {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            requestConfirmations,
            i_callbackGasLimit,
            numWords
        );
        return randomnum;
    }

    function getrandnum() public view returns (uint256) {
        return randomnum;
    }

    function getwinnerOrNot() public view returns (bool) {
        return winnerOrNot;
    }

    function getUserNum() public view returns (uint256) {
        return playerNum;
    }
}
