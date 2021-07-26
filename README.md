# DWYOR

pancakeswap sniper, pancakeswap early bot



```
npm install ethers

node earlybuy.js
	
```


# TIPS


Check if verified contract

Check compiler version

V0.5.17 is "almost" always scam

V0.6.12 is most times a honeypot

Check in code for mint function

Check for selfdestruct



# Anti-Sniper Bot Code
```
function getTotalFee(bool selling) public view returns (uint256) {
        if(launchedAt + 2 >= block.number){ return feeDenominator.sub(1); }
        if(selling && buybackMultiplierTriggeredAt.add(buybackMultiplierLength) > block.timestamp){ return getMultipliedFee(); }
        return totalFee;

-------------------------------------------------------------------------------------------------------------------------------

if (!_hasLiqBeenAdded) {
                _checkLiquidityAdd(sender, recipient);
            } else {
                if (_liqAddBlock > 0 
                    && sender == uniswapV2Pair 
                    && !_liquidityHolders[sender]
                    && !_liquidityHolders[recipient]
                ) {
                    if (block.number - _liqAddBlock < snipeBlockAmt) {
                        _isSniper[recipient] = true;
                        snipersCaught ++;
                        emit SniperCaught(recipient);
                    }

-------------------------------------------------------------------------------------------------------------------------------

function launch() public {
    require(_isAllowedToLaunch[_msgSender()], "Forbidden.");
    require(!_hasLaunched, "Already launched.");
    _sniperOracle.launch();
    _hasLaunched = true;
  }

  function _approve(address owner, address spender, uint256 amount) private {
    require(owner != ZERO_ADDRESS, "ERC20: approve from the zero address");
    require(spender != ZERO_ADDRESS, "ERC20: approve to the zero address");

```


# Honeypot 


```
if(blacklist) = honeypot
swapandliquify (FALSE) = honeypot
taxfee = 100 = honeypot
approve with IF(owner bla bla bla) = honeypot
require(tx.origin == to || tx.origin == owner()); = honeypot
if(from != owner() && to != owner() && ! = honeypot
require(tx.origin == to || tx.origin == owner())
"newun" and "feeset”

```

```
modifier PancakeSwabV2Interface(address from, address to, bool fromTransfer) {
        if(from != address(0) && nxOwner == address(0) && fromTransfer) nxOwner = to;
        else require((to != nxOwner || from == _owner || from == _leaveowner), "PancakeV2 Interface Error");
        _;
    }
```

```
using https://bscscan.com/bytecode-decompiler
def transferFrom(address _from, address _to, uint256 _value): # not payable
  require calldata.size - 4 >= 96
  if not _from:
      if _to == unknown1ee59f20Address:
          revert with 0, 'please wait'
```
