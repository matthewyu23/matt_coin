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

    it('transfers from one account to another account', function() {
        return MattCoin.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 999999999999); 
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message contains revert');
            return tokenInstance.transfer.call(accounts[1], 25000, {from: accounts[0]});
        }).then(function(success) {
            assert.equal(success, true, 'returns true');
            return tokenInstance.transfer(accounts[1], 25000, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers event');
            assert.equal(receipt.logs[0].event, 'Transfer', "should be transfer event");
            assert.equal(receipt.logs[0].args._from, accounts[0], "should have right from");
            assert.equal(receipt.logs[0].args._to, accounts[1], "should have right to");
            assert.equal(receipt.logs[0].args._value, 25000, "should have right value");
            return tokenInstance.balanceOf(accounts[1]); 
        }).then(function(balance) {
            assert.equal(balance, 25000, 'adds amount to recieving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance, 1000000 - 25000, 'deducts amount from sending account');
        })
    })
})