pragma solidity >=0.4.2;
// SPDX-License-Identifier: UNLICENSED

import "./MattCoin.sol";

contract MattCoinSale {
    address admin;
    MattCoin public tokenContract; 
    uint256 public tokenPrice; 
    
    constructor(MattCoin _tokenContract, uint256 _tokenPrice) {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
}