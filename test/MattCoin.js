const MattCoin = artifacts.require("MattCoin.sol");

contract('MattCoin', function(accounts) {
    var tokenInstance;

    it('initialized contract with correct values', function() {
        return MattCoin.deployed().then(function(instance) {
            tokenInstance = instance; 
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, "Matt Coin", 'has correct name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, "Matt", 'hass correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'Matt Coin v1.0', 'has correct standard');
        })
    })

    it('allocates initial supply upon deployment', function() {
        return MattCoin.deployed().then(function(instance) {
            tokenInstance = instance; 
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000, 'allocates initial supply to admin');
        })
    }); 
})