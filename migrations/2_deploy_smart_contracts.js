const MattCoin = artifacts.require("MattCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(MattCoin);
};
