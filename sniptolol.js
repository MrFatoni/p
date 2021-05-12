//gratis jangan bacot
const ethers = require('ethers');
const wssurl = ''; //private node lebih gud
const mnemonic = ''; //privatekey tanpa 0
const amountIn = ethers.utils.parseUnits('0.003', 'ether'); //buy amount WBNB
const targettoken = '';
const liquidityminimal = '25000000000000000000'; //minimal liquidity 25 BNB https://eth-converter.com



const addresses = {
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
//  BUSD: '0x55d398326f99059ff775485246999027b3197955', CANT
  factory: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73', // v1 > '0xBCfCcbde45cE874adCB698cC183deBcF17952812',
  router: '0x10ed43c718714eb63d5aa57b78b54704e256024e', // v1 >'0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F',
  recipient: '' //your wallet addr
};


const provider = new ethers.providers.WebSocketProvider(wssurl); 
const wallet = new ethers.Wallet(mnemonic);
const account = wallet.connect(provider);

const factory = new ethers.Contract(
  addresses.factory,
  [
    'event PairCreated(address indexed token0, address indexed token1, address pair, uint)',
    'function getPair(address tokenA, address tokenB) external view returns (address pair)'
    ],
  account
);  

const erc = new ethers.Contract(
  addresses.WBNB,
  [{"constant": true,"inputs": [{"name": "_owner","type": "address"}],"name": "balanceOf","outputs": [{"name": "balance","type": "uint256"}],"payable": false,"type": "function"}],
  account
);  

const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ],
  account
);


console.log('BOT STARTED - Semoga opit');
factory.on('PairCreated', async (token0, token1, pairAddress) => {
  let tokenIn, tokenOut;
  if(token0 === addresses.WBNB && token1 === targettoken) {
    tokenIn = token0;
    tokenOut = token1;
  }

  if(token1 == addresses.WBNB && token0 === targettoken) {
    tokenIn = token1;
    tokenOut = token0;
  }

  if(typeof tokenIn === 'undefined') {
    return;
  }


try {
  
  const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]); 
  const getPairx = await factory.getPair(tokenIn, tokenOut); 
  const pairBNBvalue = await erc.balanceOf(getPairx); 
  var bnbne = ethers.utils.formatEther(pairBNBvalue);
  
  //debug
  //console.log(pairBNBvalue);
  //console.log(tokenOut);
  //console.log(`new token => https://bscscan.com/token/${tokenOut} - liquidity ${bnbne} BNB`);
  
  //var targettoken = '0xxxxxxxxxxxxx'; //targettoken
  //if(tokenOut === targettoken){ //idk
  if(pairBNBvalue > liquidityminimal){
  //console.log(`address LP ${getPairx} -  LIQ ${bnbne} BNB`)
  
  const amountOutMin = amounts[1].sub(amounts[1].div(10));

  const tx = await router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    [tokenIn, tokenOut],
    addresses.recipient,
    Date.now() + 1000 * 60 * 10, //10m,
    {
        'gasLimit': 300000,
        'gasPrice': ethers.utils.parseUnits('5', 'gwei'),
    }
  );

  console.log(`new token => https://bscscan.com/token/${tokenOut} - liquidity ${bnbne} BNB`);
  console.log('BUYING');
  

 const receipt = await tx.wait();
 console.log(`tx buying: https://www.bscscan.com/tx/${receipt.logs[1].transactionHash}`);
  
const tokennya = new ethers.Contract(
  tokenOut,
   ['function approve(address spender, uint256 amount) external returns (bool)'],
   account
);  

const approve = await tokennya.approve(
    addresses.router, //pancakerouter
    ethers.constants.MaxUint256, //max approve
    {
        'gasLimit': 400000,
        'gasPrice': ethers.utils.parseUnits('5', 'gwei'),
    }
  );


  const approvereceipt = await approve.wait();
  console.log(approvereceipt);
  process.exit(); //panic mode
    //}
  }
  
} catch(error) { 
//console.log('Error');
//console.log(error);
} 
});
