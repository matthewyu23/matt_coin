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

    it('approves tokens for delegated transfer', function() {
        return MattCoin.deployed().then(function(instance) {
            tokenInstance = instance; 
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
            assert.equal(success, true, 'returns true');
            return tokenInstance.approve(accounts[1], 100, { from: accounts[0]})
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers event');
            assert.equal(receipt.logs[0].event, 'Approval', "should be approval event");
            assert.equal(receipt.logs[0].args._owner, accounts[0], "should have right owner");
            assert.equal(receipt.logs[0].args._spender, accounts[1], "should have right spender");
            assert.equal(receipt.logs[0].args._value, 100, "should have right value");
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        })
    })

    it('handles delegated token transfers', function() {
        return MattCoin.deployed().then(function(instance) {
            tokenInstance = instance; 
            fromAccount = accounts[2]; 
            toAccount = accounts[3]; 
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, { from: accounts[0]});
        }).then(function(receipt) {
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount });
        }).then(function(receipt) {
            return tokenInstance.transferFrom(fromAccount, toAccount, 10000, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer more than balance');
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer more than allowance')
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount }) 
        }).then(function(success) {
            assert.equal(success, true, 'transfering returns true')
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount }) 
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers event');
            assert.equal(receipt.logs[0].event, 'Transfer', "should be transfer event");
            assert.equal(receipt.logs[0].args._from, fromAccount, "should have right from");
            assert.equal(receipt.logs[0].args._to, toAccount, "should have right to");
            assert.equal(receipt.logs[0].args._value, 10, "should have right value");
            return tokenInstance.balanceOf(fromAccount)
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 90, 'from account has correct balance')
            return tokenInstance.balanceOf(toAccount)
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 10, 'to account has correct balance')
            return tokenInstance.allowance(fromAccount, spendingAccount)
        }).then(function(allowance) {
            assert.equal(allowance, 0, 'updates allowance')
        })
    })
})