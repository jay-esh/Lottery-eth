// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
// import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

error RaffleError();
error EthPlayingError(bool winnerornot);
error EthTransferError();

contract Lottery is VRFConsumerBaseV2 {
    event Random(
        uint256 indexed requestid,
        uint256 indexed randomnumber,
        address from,
        bool winnerOrNot
    );
    event Winner(bool winnerOrNot, address winner);

    uint256 private immutable i_entranceFee;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant requestConfirmations = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant numWords = 2;
    uint256 public randomnum;
    address payable public player;
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
            player = payable(msg.sender);
            playerNum = num;
            if (msg.value == amount) {
                gambelledamount = amount;
                if (num == randomnum) {
                    winnerOrNot = true;
                }
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
        // emit Random(0, randomnum, player);
        // randomnum = randomWords[0] % 6;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        randomnum = randomWords[1] % 6;
        if (randomnum == playerNum) {
            winnerOrNot = true;
        }
        emit Random(requestId, randomnum, player, winnerOrNot);
    }

    function playing() public {
        if (randomnum == playerNum) {
            // address payable winner = player;
            (bool success, ) = player.call{value: address(this).balance}("");
            if (success) {
                emit Winner(winnerOrNot, player);
            } else {
                revert EthTransferError();
            }
        } else {
            revert EthPlayingError(false);
        }
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
        emit Random(requestId, randomnum, player, winnerOrNot);
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

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
