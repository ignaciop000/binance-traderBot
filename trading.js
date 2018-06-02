const { print, wait, format } = require('./utils');
const sprintf = require("sprintf-js").sprintf;
const Orders = require('./orders');

// Define static vars
const BNB_COMMISION   = 0.0005;
const WAIT_TIME_BUY_SELL = 1000 // miliseconds
const WAIT_TIME_CHECK_BUY_SELL = 200 // miliseconds
const WAIT_TIME_CHECK_SELL = 5000 // miliseconds
const WAIT_TIME_STOP_LOSS = 20000 // miliseconds

class Trading {

    constructor(io, option) {
        this.io = io;
        this.option = option;
        this.quantity = option.quantity;
        this.stop_loss = option.stop_loss;
        this.increasing = option.increasing;
        this.decreasing = option.decreasing;

        if (option.wait_time == null) {
            //default value
            this.wait_time = 0.7 * 1000;      
        } else { 
            this.wait_time = option.wait_time * 1000;  
        }

        if (option.debug == null) {
            //default value
            this.debug = false;
        } else { 
            this.debug = true;
        }    

        // Define trade vars  
        this.order_id = 0;
        this.order_data = null;
        this.sell_order_id = 0;
        this.buy_filled = true
        this.sell_filled = true
        this.buy_filled_qty = 0
        this.sell_filled_qty = 0

        // percent (When you drop 10%, sell panic.)
        this.stop_loss = 0

        //BTC amount
        this.amount = 0

        // float(step_size * math.floor(float(free)/step_size))
        this.step_size = 0

        // Type of commision, Default BNB_COMMISION
        this.commision = BNB_COMMISION
        this.lastmsg = "";
    }

    getClient() {
        return Orders;
    }

    async filters() {
        let symbol = this.option.symbol;

        //Get symbol exchange info
        let symbol_info = await Orders.get_info(symbol);

        if (!symbol_info) {
            //print('Invalid symbol, please try again...')
            print('Invalid symbol, please try again...');
            process.exit(1);
        }

        //symbol_info['filters'] = {item['filterType']: item for item in symbol_info['filters']}
        for (let filter of symbol_info['filters']) {
            symbol_info.filters[filter.filterType] = filter;
        }
        return symbol_info.filters;        
    }


    async validate() {
        try {
            let valid = true;
            let symbol = this.option.symbol;
            let filters = await this.filters();

            //Order book prices
            let last = await Orders.get_order_book(symbol);

            let lastPrice = await Orders.get_ticker(symbol);
            if (lastPrice == null) {
                print ('Error, getting lastPrice');
                valid = false;
            }
            let minQty = parseFloat(filters.LOT_SIZE.minQty)
            let minPrice = parseFloat(filters.PRICE_FILTER.minPrice)
            let minNotional = parseFloat(filters.MIN_NOTIONAL.minNotional)
            let quantity = parseFloat(this.option.quantity)

            //stepSize defines the intervals that a quantity/icebergQty can be increased/decreased by.
            let stepSize = parseFloat(filters.LOT_SIZE.stepSize)

            //tickSize defines the intervals that a price/stopPrice can be increased/decreased by
            let tickSize = parseFloat(filters.PRICE_FILTER.tickSize)

            //If option increasing default tickSize greater than
            if (parseFloat(this.option.increasing) < tickSize){
                this.increasing = tickSize
            }

            //If option decreasing default tickSize greater than
            if (parseFloat(this.option.decreasing) < tickSize){
                this.decreasing = tickSize
            }

            // Just for validation
            last.lastBid = last.lastBid + this.increasing

            // Set static
            // If quantity or amount is zero, minNotional increase 10%
            quantity = (minNotional / last.lastBid)
            quantity = quantity + (quantity * 10 / 100)
            let notional = minNotional

            if (this.amount > 0) {
                // Calculate amount to quantity
                quantity = (this.amount / lastBid)
            }
            if (this.quantity > 0) {
                // Format quantity step
                quantity = this.quantity
            }
            quantity = this.format_step(quantity, stepSize)
            notional = last.lastBid * parseFloat(quantity)

            // Set Globals
            this.quantity = quantity
            this.step_size = stepSize

            // minQty = minimum order quantity
            if (quantity < minQty) {
                //print('Invalid quantity, minQty: %.8f (u: %.8f)' % (minQty, quantity))
                print('Invalid quantity, minQty: %.8f (u: %.8f)' , minQty, quantity)
                valid = false
            }

            if (lastPrice < minPrice) {
                //print('Invalid price, minPrice: %.8f (u: %.8f)' % (minPrice, lastPrice))
                print('Invalid price, minPrice: %.8f (u: %.8f)' , minPrice, lastPrice)
                valid = false
            }

            //minNotional = minimum order value (price * quantity)
            if (notional < minNotional) {
                //print('Invalid notional, minNotional: %.8f (u: %.8f)' % (minNotional, notional))
                print('Invalid notional, minNotional: %.8f (u: %.8f)' ,minNotional, notional)
                valid = false
            }

            if (!valid) {
                process.exit(1)
            }
        } catch (err) {
            print("Error Validate %s", err);
            process.exit(1);
        }
        
    }

    format_step(quantity, stepSize){
        return parseFloat(stepSize * Math.floor(parseFloat(quantity)/stepSize))
    }

    calc(lastBid){ 
        try {
            //Estimated sell price considering commision
            return lastBid + (lastBid * this.option.profit / 100) + (lastBid * this.commision);
            //return lastBid + (lastBid * self.option.profit / 100)

        } catch (err) {
            print('Calc Error: %s', err);
            return
        }
    }

    async action(symbol) {
        try {
            //Order amount
            let quantity = this.quantity;

            //Fetches the ticker price
            let lastPrice = await Orders.get_ticker(symbol);
            if (lastPrice == null) {
                print('Error, getting lastPrice');
                return;
            }

            // Order book prices
            let last = await Orders.get_order_book(symbol)

            //Target buy price, add little increase #87
            let buyPrice = last.lastBid + this.increasing

            //Target sell price, decrease little 
            let sellPrice = last.lastAsk - this.decreasing

            // Spread ( profit )
            let profitableSellingPrice = this.calc(last.lastBid)

            // Check working mode
            if (this.option.mode == 'range') {
                buyPrice = this.option.buyprice
                sellPrice = this.option.sellprice
                profitableSellingPrice = sellPrice
            }

            let spreadPerc = (last.lastAsk/last.lastBid - 1) * 100.0
            //print('price: %.8f buyprice: %.8f sellprice: %.8f bid: %.8f ask: %.8f spread: %.2f Originalsellprice: %.8f' ,lastPrice, buyPrice, profitableSellingPrice, last.lastBid, last.lastAsk, spreadPerc, profitableSellingPrice-(last.lastBid *this.commision))
            this.io.emit('update', { 
                symbol:symbol,
                mode:this.option.mode,
                buyQty: format(this.quantity),
                increasing: format(this.increasing),
                decreasing: format(this.decreasing),
                profit: this.option.profit + '%',
                stopLoss: this.stop_loss,
                lastPrice:format(lastPrice),
                buyPrice:format(buyPrice),
                profitableSellingPrice: format(profitableSellingPrice),
                lastBid: format(last.lastBid),
                lastAsk: format(last.lastAsk),
                spreadPerc: format(spreadPerc),
                originalsellprice: format(profitableSellingPrice -(last.lastBid *this.commision)) 
            });            

            if (this.order_id > 0) {
                //Profit mode
                if (this.order_data != null) {
                    order = this.order_data
                    // Last control
                    let newProfitableSellingPrice = this.calc(parseFloat(order.price))
                    if (last.lastAsk >= newProfitableSellingPrice){
                        profitableSellingPrice = newProfitableSellingPrice
                    }
                }
                //range mode
                if (this.option.mode == 'range') {
                    profitableSellingPrice = this.option.sellprice;
                }
                           
                // If the order is complete, try to sell it.            

                // Perform buy action
                await this.sell(symbol, quantity, this.order_id, profitableSellingPrice, lastPrice);            
                return
            } else 

            /*
            Did profit get caught
            if ask price (Buy Price) is greater than profit price (sell Price + Profit + Commission), 
            buy with my buy price,    
            */                   
            if (this.order_id == 0) {
                if (this.debug) {
                    let actualProfit = (((last.lastAsk - (last.lastBid * this.commision)) / last.lastBid )-1) * 100; 
                    let msg = sprintf ('Symbol: %s Profit: %.2f Expected Profit: %.2f ASK: %.8f BID: %.8f Commission: %.8f profitSelling %.8f',this.option.symbol, actualProfit, this.option.profit ,last.lastAsk, last.lastBid,  this.commision, profitableSellingPrice);                    
                    if (msg != this.lastmsg) {
                        print ('%s', msg);
                        this.lastmsg = msg;
                    }

                }
                if ((last.lastAsk >= profitableSellingPrice && this.option.mode == 'profit') || (lastPrice <= this.option.buyprice && this.option.mode == 'range')) {
                    //print ("Mode: %s, LastAsk: %s, Profit Sell Price %s, ", this.option.mode, last.lastAsk, profitableSellingPrice);                   
                    let orderId = await this.buy(symbol, quantity, buyPrice, profitableSellingPrice);
                    let orderDTO = {};
                    orderDTO.symbol = symbol; 
                    orderDTO.orderIdBuy = this.order_id;
                    orderDTO.buyPrice = format(buyPrice);
                    orderDTO.quantity = quantity;
                    this.io.emit('orders',orderDTO);                                        
                }
            }
        } catch (err) {
            print("Error action %s", err);
        }
    }

    async buy( symbol, quantity, buyPrice, profitableSellingPrice) {

        //Do you have an open order?
        this.check_order()

        try {

            // Create order
            let orderId = await Orders.buy_limit(symbol, quantity, buyPrice)

            //Database log
            //Database.write([orderId, symbol, 0, buyPrice, 'BUY', quantity, self.option.profit])

            //print('Buy order created id:%d, q:%.8f, p:%.8f' % (orderId, quantity, float(buyPrice)))
            print('%s : Buy order created id:%d, quantity:%.8f, buyPrice:%.8f, Take profit aprox :%.8f' ,symbol, orderId, quantity, parseFloat(buyPrice), profitableSellingPrice)

            this.order_id = orderId
            return orderId

        } catch (err) {
            print('Buy error: %s' , err)
            await wait(WAIT_TIME_BUY_SELL)
            return null
        }
    }

    async sell(symbol, quantity, orderId, sell_price, last_price) {
        
        let orderDTO = {};
        let sell_order = null;
        orderDTO.orderIdBuy = orderId;  
        orderDTO.symbol = symbol;      
        if (this.sell_order_id == 0) {
            /*
            The specified limit will try to sell until it reaches.
            If not successful, the order will be canceled.
            */
            let orderDTO = {};
            let buy_order = await Orders.get_order(symbol, orderId)
            orderDTO.symbol = symbol;
            orderDTO.orderIdBuy = orderId;
            orderDTO.statusBuy = buy_order.status;        
            if (buy_order.status == 'FILLED' && buy_order.side == 'BUY') {
                //print('Buy order filled... Try sell...')
                print('Buy order filled... Try sell...')
            } else {
                await wait(WAIT_TIME_CHECK_BUY_SELL)
                if (buy_order.status == 'FILLED' && buy_order.side == 'BUY') {
                    //print('Buy order filled after 0.1 second... Try sell...')
                    print('Buy order filled after 0.1 second... Try sell...')
                } else if (buy_order.status == 'PARTIALLY_FILLED' && buy_order.side == 'BUY') {
                    //print('Buy order partially filled... Try sell... Cancel remaining buy...')
                    print('Buy order partially filled... Try sell... Cancel remaining buy...')
                    await this.cancel(symbol, orderId)
                } else {
                    await this.cancel(symbol, orderId)
                    //print('Buy order fail (Not filled) Cancel order...')
                    print('Buy order fail (Not filled) Cancel order...')
                    this.order_id = 0
                    orderDTO.statusBuy = 'Canceled';
                    this.io.emit('orders',orderDTO);
                    return
                }
            }
            let last = await Orders.get_order_book(symbol)
            //print("Market - Quantity:%.8f Profit:%.8f buyPrice:%.8f sellPrice:%.8f",quantity ,format( quantity * ( last.lastBid - buy_order.price)), buy_order.price, last.lastBid);
                    
            sell_order = await Orders.sell_limit(symbol, quantity, sell_price)        
            orderDTO.sellPrice = sell_price;
            let sell_id = sell_order.orderId
            this.sell_order_id = sell_id;
            orderDTO.orderIdSell = sell_order.orderId;

            //print('Sell order create id: %d' % sell_id)
            print('Sell order create id: %d' , sell_id)
        } else {
           sell_order =  await Orders.get_order(symbol, this.sell_order_id);
        }

        await wait(WAIT_TIME_CHECK_SELL)
        orderDTO.statusSell = sell_order.status;
        if (sell_order.status == 'FILLED') {
            print('Sell order (Filled) Id: %d', this.sell_order_id)
            print('LastPrice : %.8f', last_price)
            print('Profit: %%%s. Buy price: %.8f Sell price: %.8f' , format( quantity * ( sell_price - sell_order.price)), parseFloat(sell_order.price), sell_price)

            this.order_id = 0
            this.sell_order_id = 0
            this.order_data = null
            orderDTO.profit = format( quantity * ( sell_price - sell_order.price));
            this.io.emit('orders',orderDTO);
            return
        } else {
            orderDTO.statusSell = 'WAITING';
            this.io.emit('orders',orderDTO);
        }

        /*
        If all sales trials fail, 
        the grievance is stop-loss.
        */

        if (this.stop_loss > 0) {

            // If sell order failed after 5 seconds, 5 seconds more wait time before selling at loss
            await wait(WAIT_TIME_CHECK_SELL)
            let status_order;
            let isStop = await this.stop(symbol, quantity, sell_id, last_price);
            if (isStop) {
                status_order = await Orders.get_order(symbol, sell_id);
                if (status_order.status != 'FILLED') {
                    //print('We apologize... Sold at loss...')
                    print('We apologize... Sold at loss...')
                }

            } else {
                print('We apologize... Cant sell even at loss... Please sell manually... Stopping program...')
                await this.cancel(symbol, sell_id)
                process.exit(1)
            }
            let sell_status = "";
            while (sell_status != 'FILLED') {
                await wait(WAIT_TIME_CHECK_SELL)
                status_order = await Orders.get_order(symbol, sell_id);
                sell_status = status_order.status
                lastPrice = await Orders.get_ticker(symbol)
                print('Sold! Continue trading...')    
                //print('Status: %s Current price: %.8f Sell price: %.8f' % (sell_status, lastPrice, sell_price))        
            }

            this.order_id = 0
            this.order_data = null

        } 
        this.io.emit('orders',orderDTO);        
    }


    async stop( symbol, quantity, orderId, last_price) {
        // If the target is not reached, stop-loss.
        let stop_order = await Orders.get_order(symbol, orderId);
        let stopprice =  this.calc(parseFloat(stop_order.price));
        let lossprice = stopprice - (stopprice * this.stop_loss / 100);
        let status = stop_order.status;

        // Order status
        if (status == 'NEW' || status == 'PARTIALLY_FILLED') {
            let isCancel = await this.cancel(symbol, orderId);
            if (isCancel) {
                let sello = null;
                // Stop loss
                if (last_price >= lossprice){

                    sello = await Orders.sell_market(symbol, quantity)

                    print('Stop-loss, sell market, %s' , last_price)

                    let sell_id = sello.orderId

                    if (sello == true){
                        return true;
                    } else {
                        // Wait a while after the sale to the loss.
                        await wait(WAIT_TIME_STOP_LOSS)
                        let statusloss = sello.status
                        if (statusloss != 'NEW'){                            
                            print('Stop-loss, sold')
                            return true
                        } else {
                            await this.cancel(symbol, sell_id)
                            return false
                        }
                    }
                } else {
                    sello = await Orders.sell_limit(symbol, quantity, lossprice)
                    print('Stop-loss, sell limit, %s', (lossprice))
                    await(WAIT_TIME_STOP_LOSS)
                    let statusloss = sello.status
                    if (statusloss != 'NEW'){
                        print('Stop-loss, sold')
                        return true
                    }else{
                        await this.cancel(symbol, sell_id)
                        return false
                    }
                }
            } else {
                print('Cancel did not work... Might have been sold before stop loss...')
                return true
            }

        } else if (status == 'FILLED') {
            this.order_id = 0
            this.order_data = null
            print('Order filled')
            return true
        } else {
            return false
        }
    }

    check_order() {
        // If there is an open order, exit.
        if (this.order_id > 0) {
            print('Error, you have already open an order');
            process.exit(1);
        }
    }

    async cancel(symbol, orderId){
        // If order is not filled, cancel it.
        let check_order = await Orders.get_order(symbol, orderId)

        if (!check_order) {
            this.order_id = 0
            this.order_data = null
            return true
        }

        if (check_order.status == 'NEW' || check_order.status != 'CANCELLED') {
            await Orders.cancel_order(symbol, orderId)
            this.order_id = 0
            this.order_data = null
            return true
        }
    }

    async run() {
        let cycle = 0;
        let actions = [];

        let symbol = this.option.symbol;
        
        // Validate symbol
        await this.validate();

        print('Started...');
        print('Trading Symbol: %s', symbol);
        print('Buy Quantity: %.8f', this.quantity);
        print('Stop-Loss Amount: %s', this.stop_loss);
        //console.log('Estimated profit: %.8f' % (self.quantity*self.option.profit))

        if (this.option.mode == 'range') {
            if (this.option.buyprice == null || this.option.sellprice == null) {
                print('Please set on coins options buyprice and sellprice');
                process.exit(1);
            }
            print('Range Mode Options:')
            print('\tBuy Price: %.8f', this.option.buyprice)
            print('\tSell Price: %.8f', this.option.sellprice)
        } else {
            print('Profit Mode Options:');
            print('\tPreferred Profit: %0.2f%%', this.option.profit);
            print('\tBuy Price : (Bid+ --increasing %.8f)', this.increasing);
            print('\tSell Price: (Ask- --decreasing %.8f)', this.decreasing);
        }

        print('\n');

        let startTime = new Date().getTime();
        let endTime = new Date().getTime();

        while (cycle <= this.option.loop) {
            startTime = new Date().getTime();

            await this.action(symbol);
            endTime = new Date().getTime();
            if (endTime - startTime < this.wait_time) {
               await wait(this.wait_time - (endTime - startTime))

               // 0 = Unlimited loop
               if (this.option.loop > 0){
                   cycle = cycle + 1
               }
           }           
        }
    }
}

module.exports.Trading = Trading