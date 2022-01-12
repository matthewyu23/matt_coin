pragma solidity >=0.4.2;
// SPDX-License-Identifier: UNLICENSED

contract MattCoin {
    string public name = "Matt Coin";
    string public symbol = "Matt";
    string public standard = 'Matt Coin v1.0'; 
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }
}