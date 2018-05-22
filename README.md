# Binance Trader Bot (NodeJS)

This is a bot for auto trading the binance.com exchange based on https://github.com/yasinkuyu/binance-trader

![Screenshot](https://github.com/ignaciop000/binance-traderBot/blob/master/img/screenshot.png)

## Configuration

1. [Signup](https://www.binance.com/?ref=25579592) for Binance
1. Enable Two-factor Authentication
1. Go API Center, [Create New](https://www.binance.com/userCenter/createApi.html) Api Key

        [✓] Read Info [✓] Enable Trading [X] Enable Withdrawals

1. Get an API and Secret Key, insert into `config.js`
        {
			api: "<API key for account access>",
    		secret: "<Secret key for account access>"
		}

        [API Docs](https://www.binance.com/restapipub.html) 
        
## Requirements

	NodeJs (https://nodejs.org/en/)

## Installation

	npm install

## Usage

    npm start

    Open Browser (http://localhost:3001)
    
    Example coins.js 

[
{
	symbol:'ZECBTC',
	quantity:0,
	stop_loss:0,
	mode:'profit',
	profit:1.0,
	increasing:0.00000001,
	decreasing:0.00000001,
	loop:0,
	wait_time:0.7,
	prints: 1,
},
{
	symbol:'ETHBTC',
	quantity:0,
	stop_loss:0,
	mode:'profit',
	profit:1.0,
	increasing:0.00000001,
	decreasing:0.00000001,
	loop:0,
	wait_time:0.7,
	prints: 1,
}]

	quantity     Buy/Sell Quantity (default 0) (If zero, auto calc)
    amount       Buy/Sell BTC Amount (default 0)
    symbol       Market Symbol (default XVGBTC or XVGETH)
    profit       Target Profit Percentage (default 1.3)
    stop_loss    Decrease sell price at loss Percentage (default 0)
    orderid      Target Order Id (default 0)
    wait_time    Wait Time (seconds) (default 0.7)
    increasing   Buy Price Increasing  +(default 0.00000001)
    decreasing   Sell Price Decreasing -(default 0.00000001)
    prints       Scanning Profit Screen Print (default True)
    loop         Loop (default 0 unlimited)
    
    mode         Working modes profit or range (default profit)
                   profit: Profit Hunter. Find defined profit, buy and sell. (Ex: 1.3% profit)
                   range: Between target two price, buy and sell. (Ex: <= 0.00000780 buy - >= 0.00000790 sell )
                   
    buyprice     Buy price (Ex: 0.00000780)
    sellprice    Buy price (Ex: 0.00000790)

    
    All binance symbols are supported.
    
## Test
	
	npm test
    
## DISCLAIMER

    I am not responsible for anything done with this bot. 
    You use it at your own risk. 
    There are no warranties or guarantees expressed or implied. 
    You assume all responsibility and liability.
     
## Contributing

    Fork this Repo
    Commit your changes (git commit -m 'Add some feature')
    Push to the changes (git push)
    Create a new Pull Request
    
    Thanks all for your contributions...    

---