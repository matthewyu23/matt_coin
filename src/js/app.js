App = {
    web3Provider: null,
    contracts: {},
    init: function() {
        console.log("App initialized");
        return App.initWeb3();
    }, 
    initWeb3: function() {
        if (typeof web3 !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
        } else {
          // Specify default instance if no web3 instance provided
          App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
          web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
      },
    initContract: function() {
        $.getJSON("MattCoinSale.json", function(mattCoinSale) {
            App.contracts.MattCoinSale = TruffleContract(mattCoinSale);
            App.contracts.MattCoinSale.setProvider(App.web3Provider);
            App.contracts.MattCoinSale.deployed().then(function(mattCoinSale) {
                console.log("MattCoinSale Address:", mattCoinSale.address);
            });


        });
    }

    
}

$(function() {
    $(window).load(function(){
        App.init();
    })
})