# Week 1 Assignment
*This is a group activity for at least 3 students:
Interact with “HelloWorld.sol” within your group to change message strings and change owners.
Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed.*
Assignment Link: https://github.com/Encode-Club-Solidity-Bootcamp/Lesson-04?tab=readme-ov-file#homework

# Group 7
Team Members:
cax8Mr - [addi1402](https://github.com/addi1402)
1Lbxcy - [Aravinds2511](https://github.com/Aravinds2511)
Pmo958 - [vermasrijan](https://github.com/vermasrijan)
IG8lqp - [aashisham](https://github.com/aashisham)
VEVWKu - @Chae-Ryeong(Chloe) Yeo

## Report

Contract Address : [https://sepolia.etherscan.io/address/0x4Af7c74e6160A4AEB81Ec3446B6Db5D28B1A4Bd6](https://sepolia.etherscan.io/address/0x4Af7c74e6160A4AEB81Ec3446B6Db5D28B1A4Bd6)
1. Arvind deployed the HelloWorld contract on sepolia testnet.Contract deployment was successful.
Contract address: `0x4Af7c74e6160A4AEB81Ec3446B6Db5D28B1A4Bd6`
Transaction hash: `0xff3bd60241eb4cae8f5adce642762d2f017f1b5fb0a37cf6edca5fac6646510a`
Current Owner: `0x2d303feda3042363bc52e486f974601856df30d9` (Arvind)

2. Arvind changed the text to 'owner is AravindS' by calling the function '`setText`', the transaction was successful.
Transaction hash: `0x71975fc500635302c003d3348f8fa1061314f557fdb3a2a9d4f510456490537c`

3. Arvind changed the owner of the contract by calling the function '`transferOwnership`' and setting `0x24786D0dE04031fE1CC6c1EC53ADa442e72Bd9A2` as the owner, the transaction was a success.
Transaction hash: `0x1743c769f548a2e35eefb0c3050b9706dd5dfb04584f2c046ed4c3fc9ceddc1b`
Current Owner: `0x24786D0dE04031fE1CC6c1EC53ADa442e72Bd9A`2 (Srijan)

4. After changing the owner Arvind tried changing the text by calling the '`setText`' function as expected it reverted with "Fail with error 'Caller is not the owner".
Transaction hash: `0xead5a602a7fb1e8c288f11c2c6220d689106a22b9cd03302c6c09504b41fc1c7`



Contract Address : https://sepolia.etherscan.io/address/0x2214521476ffa76f69a83e85b9317e784a500fc3

1. Ashish deployed the HelloWorld contract on sepolia testnet.Contract deployment was successful.
Contract address: `0x2214521476ffA76f69A83E85B9317E784a500fC3`
Transaction hash: `0xa8406e9fb440d6befcd2b7a89a3376d29175782ac2eecae850a64665831d3318`
Current Owner: `0x36956b321bdd1c78C340c9241d5F870937730208` (Ashish)

2. Ashish changed the text to 'the original text is changed here.' by calling the function '`setText`', the transaction was successful.
Transaction hash: `0xf9d78d807fe2dbe5c05fad503243d2b7fa64cae14c0b804b03a5915dfb066b00`

3. Ashish changed the owner of the contract by calling the function '`transferOwnership`' and setting `0x521187B3E9635eD91aC0e5A1888f6e3E4b97985f` as the owner, the transaction was a success.
Transaction hash: `0x1743c769f548a2e35eefb0c3050b9706dd5dfb04584f2c046ed4c3fc9ceddc1b`
Current Owner: `0x521187B3E9635eD91aC0e5A1888f6e3E4b97985f` (Aditya)

4. After changing the owner Ashish tried changing the owner by calling the ‘`transferOwnership`’ function as expected it reverted with "Fail with error 'You are not the owner of this contract".
Transaction hash: `0xf72856ea9d0dc149fbc79fb2da8121c7868941709b35d829764af07c4a7e9e15`

5. After getting ownership , Aditya changed the text to 'Hello' by calling the function '`setText`', the transaction was successful.
Transaction hash: `0xea10862c8f9660ae21ff10f4a21d3609d26ae72a4b66c8c6761e1998ea1f919c`

6. Aditya changed the owner of the contract by calling the function '`transferOwnership`' and setting `0x36956b321bdd1c78c340c9241d5f870937730208` as the owner, the transaction was a success.
Transaction hash: `0xdd2ec179826cf11daf9bdb4cbd4bc61fc3184f86b14c3f2c1614a857153b9668`
Current owner : `0x36956b321bdd1c78c340c9241d5f870937730208` (Ashish)
