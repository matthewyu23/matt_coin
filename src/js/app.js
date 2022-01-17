App = {
    web3Provider: null,
    contracts: {},
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,
    init: function() {
        console.log("App initialized");
        return App.initWeb3();
    }, 
    initWeb3: function() {
        if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
          // If a web3 instance is already provided by Meta Mask.
          window.ethereum.enable();
          App.web3Provider = window.ethereum;
          web3 = new Web3(window.ethereum);
        } else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
          web3 = new Web3(window.web3.currentProvider);
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
            })
          }).done(function() {
                $.getJSON("MattCoin.json", function(mattCoin) {
                App.contracts.MattCoin = TruffleContract(mattCoin);
                App.contracts.MattCoin.setProvider(App.web3Provider);
                App.contracts.MattCoin.deployed().then(function(mattCoin) {
                    console.log("MattCoin Address:", mattCoin.address);
                })
                return App.render()
            })
          })
    }, 
    render: function() {
      if(App.loading) {
        return;
      }
      App.loading = true;
      var loader = $("#loader");
      var content = $("#content");

      loader.show();
      content.hide();

      $("#accountAddress").html("Your Account: " + web3.currentProvider.selectedAddress
      )
      App.contracts.MattCoinSale.deployed().then(function(instance) {
        mattTokenSaleInstance = instance;
        return mattTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice) {
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.utils.fromWei(App.tokenPrice, "ether"));
        return mattTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
        var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');


        App.contracts.MattCoin.deployed().then(function(instance) {
          mattTokenInstance = instance;
          return mattTokenInstance.balanceOf(web3.currentProvider.selectedAddress);
        }).then(function(balance) {
          $('.matt-balance').html(balance.toNumber());
        })
        
        App.loading = false;
        loader.hide();
        content.show();
      })
    }, 
    
    buyTokens: function() {
      $('#content').hide();
      $('#loader').show();
      var numberOfTokens = $('#numberOfTokens').val();
      App.contracts.MattCoinSale.deployed().then(function(instance) {
        return instance.buyTokens(numberOfTokens, {
          from: web3.currentProvider.selectedAddress,
          value: numberOfTokens * App.tokenPrice,
          gas: 500000 // Gas limit
        });
      }).then(function(result) {
        console.log("Tokens bought...")
        $('form').trigger('reset') // reset number of tokens in form
        // Wait for Sell event
      });
    }
  

    
}

$(function() {
    $(window).load(function(){
        App.init();
    })
})