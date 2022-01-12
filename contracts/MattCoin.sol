pragma solidity >=0.4.2;
// SPDX-License-Identifier: UNLICENSED

contract MattCoin {
    string public name = "Matt Coin";
    string public symbol = "Matt";
    string public standard = 'Matt Coin v1.0'; 
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    
    event Transfer(
        address indexed _from, 
        address indexed _to, 
        uint256 _value
    );
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}