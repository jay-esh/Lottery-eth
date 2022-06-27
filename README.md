# Lottery-eth Project

This project is a simple solidity smart contract that allows anyone having an ethereum wallet to register for the lottery/gamble with a number between 0 and 5.

To decide if the player won the game or not depends if the random number requested from chainlink VRF contract([link](https://docs.chain.link/docs/get-a-random-number/)) is equal to the number that was given by the user when registering for the game/lottery.

For this project I use [hardhat](https://hardhat.org/) and some other libraries.

### For running this locally

You can clone this repo then cd into the directory of this project on your machine and run the command below(depending if you have yarn or npm)

```
yarn install
```
or
```
npm install
```
You can then run 
```
yarn hardhat compile
yarn hardhat deploy
```
or
```
npm hardhat compile
npm hardhat deploy 
```
For running a local node 
```
yarn hardhat node
```
or 
```
npm hardhat node
```