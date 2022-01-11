const MattCoin = artifacts.require("MattCoin.sol");

contract('MattCoin', function(accounts) {
    it('sets total supply upon deployment', function() {
        return MattCoin.deployed().then(function(instance) {
            return instance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply to 1,000,000')
        })
    }); 

})