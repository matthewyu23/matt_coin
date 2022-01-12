const MattCoin = artifacts.require("MattCoin.sol");
const MattCoinSale = artifacts.require("MattCoinSale.sol");

module.exports = function (deployer) {
  deployer.deploy(MattCoin, 1000000).then(function() {
    var tokenPrice = 1000000000000000;
    return deployer.deploy(MattCoinSale, MattCoin.address, tokenPrice);
  });
  
};
