// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";


interface IPancakeswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

interface IPancakeswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
    
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

interface IPancakeswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountBNBMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountBNB, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountBNBMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountBNB);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountBNBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountBNB);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IPancakeswapV2Router02 is IPancakeswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amounBNBMin,
        address to,
        uint deadline
    ) external returns (uint amountBNB);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amounBNBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountBNB);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

contract COBTRY is Context, IERC20, Ownable {
    
    using SafeMath for uint256;
    using Address for address;
    
    string constant private _name = "COBTRY";
    string constant private _symbol = "COBT";
    uint8 constant private _decimals = 18;

    bool public isPresale;
    bool public isOpenForPublic;
    bool public isClaimingPresale;
    bool public presaleEnded;
    mapping (address => bool) public isWhitelisted;
    mapping (address => uint256) public buyInPreSaleAmount;
    mapping (address => bool) public isJoinedPresale;
    mapping (address => bool) public claimedPresaleToken;
    uint256 public maxBuy = 2 * 10 ** 18;
    uint256 public hardCap = 800 * 10 ** 18;
    uint256 public totalBuy;
    uint256 public tokensForPresale;

    address payable public marketingWalletAddress = payable(0x4cBd1dC810dAd2B1036A1AC89DF93878C110b8a9); 
    address payable public developmentWalletAddress = payable(0xB629294EBd240F2D390c9AB69ded195ffC9E7fd8); 
    address constant public deadAddress = 0x000000000000000000000000000000000000dEaD;
    
    mapping (address => uint256) private _balances;
    mapping (address => mapping (address => uint256)) private _allowances;
    
    mapping (address => bool) public isExcludedFromFee;
    mapping (address => bool) public isTxLimitExempt;
    mapping (address => bool) public isMarketPair;
    mapping (address => bool) public isWalletLimitExempt;

    uint256 public _marketingFeeOnBuy = 30;
    uint256 public _developmentFeeOnBuy = 60;
    uint256 public _liquidityFeeOnBuy = 10;
    uint256 public _totalTaxOnBuy = 0;

    uint256 public _marketingFeeOnSell = 30;
    uint256 public _developmentFeeOnSell = 60;
    uint256 public _liquidityFeeOnSell = 10;
    uint256 public _totalTaxOnSell = 0;

    uint256 constant private _totalSupply = 100 * 10**6 * 10**18;
    uint256 public _maxTxAmount = 1 * 10**6 * 10**18;
    uint256 public _walletMax = 2 * 10**6 * 10**18;
    uint256 private minimumTokensBeforeSwap = 10000 * 10**18; 

    IPancakeswapV2Router02 public pancakeswapV2Router;
    address public pancakeswapPair;
    
    bool private inSwapAndLiquify;
    bool public swapAndLiquifyEnabled = true;
    bool public swapAndLiquifyByLimitOnly = false;
    bool public checkWalletLimit = true;

    event SwapAndLiquifyEnabledUpdated(bool enabled);
    event SwapAndLiquify(
        uint256 tokensSwapped,
        uint256 bnbReceived,
        uint256 tokensIntoLiquidity
    );
    
    event SwapBNBForTokens(
        uint256 amountIn,
        address[] path
    );
    
    event SwapTokensForBNB(
        uint256 amountIn,
        address[] path
    );

    event MarketPairUpdated(address account, bool isMarketPair);

    event ExemptedFromTxLimit(address holder, bool isExempt);

    event ExemptedFromWalletLimit(address holder, bool isExempt);

    event ExemptedFromFees(address account, bool isExempt);

    event MaxWalletCheckChanged(bool enabled);

    event WalletLimitChanged(uint256 newLimit);

    event MaxTxAmountChanged(uint256 maxTxAmount);

    event SwapThresholdChanged(uint256 swapThreshold);

    event SwapAndLiquifyByLimitOnlyChanged(bool swapByLimitOnly);

    event BuyTaxesChanged(uint256 newLiquidityFee, uint256 newMarketingFee, uint256 newDevelopmentFee);

    event SellTaxesChanged(uint256 newLiquidityFee, uint256 newMarketingFee, uint256 newDevelopmentFee);

    event MarketingWalletChanged(address newAddress);

    event DevelopmentWalletWalletChanged(address newAddress);

    event RouterVersionChanged(address newAddress);

    event BoughtInPresale(address indexed buyer, uint indexed amount);
    
    event TokensClaimed(address account);

    event PresaleStarted();

    event PresaleStopped();

    event PublicOpend();

    event PresaleEnded();

    event ClaimingOpend();


    modifier lockTheSwap {
        inSwapAndLiquify = true;
        _;
        inSwapAndLiquify = false;
    }
    
    constructor () {
        
        IPancakeswapV2Router02 _pancakeswapV2Router = IPancakeswapV2Router02(0xD99D1c33F9fC3444f8101754aBC46c52416550D1); 

        pancakeswapPair = IPancakeswapV2Factory(0x182859893230dC89b114d6e2D547BFFE30474a21)
            .createPair(address(this), 0xBdf1a2e17DECb2aAC725F0A1C8C4E2205E70719C);

        pancakeswapV2Router = _pancakeswapV2Router;
        _allowances[address(this)][address(pancakeswapV2Router)] = _totalSupply;

        isExcludedFromFee[owner()] = true;
        isExcludedFromFee[address(this)] = true;
        isExcludedFromFee[address(marketingWalletAddress)] = true;
        isExcludedFromFee[address(developmentWalletAddress)] = true;

        isTxLimitExempt[owner()] = true;
        isTxLimitExempt[address(this)] = true;
        isTxLimitExempt[address(marketingWalletAddress)] = true;
        isTxLimitExempt[address(developmentWalletAddress)] = true;

        isWalletLimitExempt[owner()] = true;
        isWalletLimitExempt[address(pancakeswapPair)] = true;
        isWalletLimitExempt[address(this)] = true;
        isWalletLimitExempt[address(marketingWalletAddress)] = true;
        isWalletLimitExempt[address(developmentWalletAddress)] = true;
        
        isMarketPair[address(pancakeswapPair)] = true;

        _totalTaxOnBuy = _liquidityFeeOnBuy.add(_marketingFeeOnBuy).add(_developmentFeeOnBuy);
        _totalTaxOnSell = _liquidityFeeOnSell.add(_marketingFeeOnSell).add(_developmentFeeOnSell);
        _balances[_msgSender()] = _totalSupply;

        emit Transfer(address(0), _msgSender(), _totalSupply);
    }

    function name() public pure returns (string memory) {
        return _name;
    }

    function symbol() public pure returns (string memory) {
        return _symbol;
    }

    function decimals() public pure returns (uint8) {
        return _decimals;
    }

    function totalSupply() public pure override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner_, address spender) public view override returns (uint256) {
        return _allowances[owner_][spender];
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function minimumTokensBeforeSwapAmount() public view returns (uint256) {
        return minimumTokensBeforeSwap;
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function _approve(address owner_, address spender, uint256 amount) private {
        require(owner_ != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner_][spender] = amount;
        emit Approval(owner_, spender, amount);
    }

    function setMarketPairStatus(address account, bool newValue) public onlyOwner {
        isMarketPair[account] = newValue;
        emit MarketPairUpdated(account, newValue);
    }

    function setIsTxLimitExempt(address holder, bool exempt) external onlyOwner {
        isTxLimitExempt[holder] = exempt;
        emit ExemptedFromTxLimit(holder, exempt);
    }
    
    function enableDisableWalletLimit(bool newValue) external onlyOwner {
       checkWalletLimit = newValue;
       emit MaxWalletCheckChanged(newValue);
    }

    function setIsWalletLimitExempt(address holder, bool exempt) external onlyOwner {
        isWalletLimitExempt[holder] = exempt;
        emit ExemptedFromWalletLimit(holder, exempt);
    }

    function setWalletLimit(uint256 newLimit) external onlyOwner {
        _walletMax  = newLimit;
        emit WalletLimitChanged(newLimit);
    }

    function setIsExcludedFromFee(address account, bool newValue) public onlyOwner {
        isExcludedFromFee[account] = newValue;
        emit ExemptedFromFees(account, newValue);
    }

    
    function setBuyTaxes(uint256 newLiquidityFee, uint256 newMarketingFee, uint256 newDevelopmentFee) external onlyOwner() {
        _liquidityFeeOnBuy = newLiquidityFee;
        _marketingFeeOnBuy = newMarketingFee;
        _developmentFeeOnBuy = newDevelopmentFee;

        _totalTaxOnBuy = _liquidityFeeOnBuy.add(_marketingFeeOnBuy).add(_developmentFeeOnBuy);
        require(_totalTaxOnBuy <= 300, "Cannot exceed 30%");
        emit BuyTaxesChanged(newLiquidityFee, newMarketingFee, newDevelopmentFee);
    }

    function setSellTaxes(uint256 newLiquidityFee, uint256 newMarketingFee, uint256 newDevelopmentFee) external onlyOwner() {
        _liquidityFeeOnSell = newLiquidityFee;
        _marketingFeeOnSell = newMarketingFee;
        _developmentFeeOnSell = newDevelopmentFee;

        _totalTaxOnSell = _liquidityFeeOnSell.add(_marketingFeeOnSell).add(_developmentFeeOnSell);
        require(_totalTaxOnSell <= 300, "Cannot exceed 30%");
        emit SellTaxesChanged(newLiquidityFee, newMarketingFee, newDevelopmentFee);
    }

    function setMaxTxAmount(uint256 maxTxAmount) external onlyOwner() {
        _maxTxAmount = maxTxAmount;
        emit MaxTxAmountChanged(maxTxAmount);
    }

    function setNumTokensBeforeSwap(uint256 newLimit) external onlyOwner() {
        minimumTokensBeforeSwap = newLimit;
        emit SwapThresholdChanged(newLimit);
    }

    function setMarketingWalletAddress(address newAddress) external onlyOwner() {
        require(newAddress != address(0), "New address cannot be zero address");
        marketingWalletAddress = payable(newAddress);
        emit MarketingWalletChanged(newAddress);
    }


    function setDevelopmentWalletAddress(address newAddress) external onlyOwner() {
        require(newAddress != address(0), "New address cannot be zero address");
        developmentWalletAddress = payable(newAddress);
        emit DevelopmentWalletWalletChanged(newAddress);
    }

    function setSwapAndLiquifyEnabled(bool _enabled) public onlyOwner {
        swapAndLiquifyEnabled = _enabled;
        emit SwapAndLiquifyEnabledUpdated(_enabled);
    }

    function setSwapAndLiquifyByLimitOnly(bool newValue) public onlyOwner {
        swapAndLiquifyByLimitOnly = newValue;
        emit SwapAndLiquifyByLimitOnlyChanged(newValue);
    }
    
    function getCirculatingSupply() public view returns (uint256) {
        return _totalSupply.sub(balanceOf(deadAddress));
    }

    function transferBNBToAddress(address payable recipient, uint256 amount) private {
        recipient.transfer(amount);
    }
    
    function changeRouterVersion(address newRouterAddress) public onlyOwner returns(address newPairAddress) {

        IPancakeswapV2Router02 _pancakeswapV2Router = IPancakeswapV2Router02(newRouterAddress); 

        newPairAddress = IPancakeswapV2Factory(_pancakeswapV2Router.factory()).getPair(address(this), _pancakeswapV2Router.WETH());

        if(newPairAddress == address(0)) //Create If Doesnt exist
        {
            newPairAddress = IPancakeswapV2Factory(_pancakeswapV2Router.factory())
                .createPair(address(this), _pancakeswapV2Router.WETH());
        }

        pancakeswapPair = newPairAddress; //Set new pair address
        pancakeswapV2Router = _pancakeswapV2Router; //Set new router address

        isWalletLimitExempt[address(pancakeswapPair)] = true;
        isMarketPair[address(pancakeswapPair)] = true;
        emit RouterVersionChanged(newRouterAddress);
    }

     //to receive BNB from PancakeswapV2Router when swapping
    receive() external payable {}

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) private returns (bool) {

        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        if(inSwapAndLiquify)
        { 
            return _basicTransfer(sender, recipient, amount); 
        }
        else
        {
            if(!isTxLimitExempt[sender] && !isTxLimitExempt[recipient]) {
                require(amount <= _maxTxAmount, "Transfer amount exceeds the maxTxAmount.");
            }            

            uint256 contractTokenBalance = balanceOf(address(this));
            bool overMinimumTokenBalance = contractTokenBalance >= minimumTokensBeforeSwap;
            
            if (overMinimumTokenBalance && !inSwapAndLiquify && !isMarketPair[sender] && swapAndLiquifyEnabled) 
            {
                if(swapAndLiquifyByLimitOnly)
                    contractTokenBalance = minimumTokensBeforeSwap;
                swapAndLiquify(contractTokenBalance);    
            }

            _balances[sender] = _balances[sender].sub(amount, "Insufficient Balance");

            uint256 finalAmount = (isExcludedFromFee[sender] || isExcludedFromFee[recipient]) ? 
                                         amount : takeFee(sender, recipient, amount);

            if(checkWalletLimit && !isWalletLimitExempt[recipient])
                require(balanceOf(recipient).add(finalAmount) <= _walletMax);

            _balances[recipient] = _balances[recipient].add(finalAmount);

            emit Transfer(sender, recipient, finalAmount);
            return true;
        }
    }

    function _basicTransfer(address sender, address recipient, uint256 amount) internal returns (bool) {
        _balances[sender] = _balances[sender].sub(amount, "Insufficient Balance");
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function swapAndLiquify(uint256 tAmount) private lockTheSwap {
        
        uint256 tokensForLP = tAmount.mul(_liquidityFeeOnSell).div(_totalTaxOnSell).div(2);
        uint256 tokensForSwap = tAmount.sub(tokensForLP);

        swapTokensForBNB(tokensForSwap);
        
        uint256 amountReceived = address(this).balance;

        uint256 totalShares = _totalTaxOnSell.sub(_liquidityFeeOnSell.div(2));
        
        uint256 bnbForLiquidity = amountReceived.mul(_liquidityFeeOnSell).div(totalShares).div(2);
        uint256 bnbForDevelopment = amountReceived.mul(_developmentFeeOnSell).div(totalShares);
        uint256 bnbForMarketing = amountReceived.sub(bnbForLiquidity).sub(bnbForDevelopment);

        if(bnbForMarketing > 0)
            transferBNBToAddress(marketingWalletAddress, bnbForMarketing);

        if(bnbForDevelopment > 0)
            transferBNBToAddress(developmentWalletAddress, bnbForDevelopment);

        if(bnbForLiquidity > 0 && tokensForLP > 0)
            addLiquidity(tokensForLP, bnbForLiquidity);
    }

    function swapTokensForBNB(uint256 tokenAmount) private {
        // generate the Pancakeswap pair path of token -> WBNB
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = pancakeswapV2Router.WETH();

        _approve(address(this), address(pancakeswapV2Router), tokenAmount);

        // make the swap
        pancakeswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0, // accept any amount of BNB
            path,
            address(this), // The contract
            block.timestamp
        );
        
        emit SwapTokensForBNB(tokenAmount, path);
    }

    function addLiquidity(uint256 tokenAmount, uint256 bnbAmount) private {
        // approve token transfer to cover all possible scenarios
        _approve(address(this), address(pancakeswapV2Router), tokenAmount);

        // add the liquidity
        pancakeswapV2Router.addLiquidityETH{value: bnbAmount}(
            address(this),
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            owner(),
            block.timestamp
        );
    }

    function takeFee(address sender, address recipient, uint256 amount) internal returns (uint256) {
        
        uint256 feeAmount = amount.mul(_totalTaxOnBuy).div(1000);   

        if(isMarketPair[recipient]) {
            feeAmount = amount.mul(_totalTaxOnSell).div(1000);  
        }
        
        if(feeAmount > 0) {
            _balances[address(this)] = _balances[address(this)].add(feeAmount);
            emit Transfer(sender, address(this), feeAmount);
        }

        return amount.sub(feeAmount);
    }
    //Presale

    function startPresale() public onlyOwner{
        isPresale = true;
        emit PresaleStarted();
    }

    function stopPresale() public onlyOwner{
        isPresale = false;
        emit PresaleStopped();
    }

    function _endPresale() internal {
        isPresale = false;
        presaleEnded = true;
        emit PresaleEnded();
    }
    function endPresale() external onlyOwner{
        _endPresale();
    }
    function setHardCap(uint _hardCap) public onlyOwner{
        hardCap = _hardCap;
    }


    function setMaxBuy(uint _maxBuy) public onlyOwner{
        maxBuy = _maxBuy;
    }

    function setTokensForPresale(uint _tokensForPresale) public onlyOwner{
        tokensForPresale = _tokensForPresale;
    }

    function enableClaimingPresale() public onlyOwner{
        isClaimingPresale = true;
        emit ClaimingOpend();
    }

    function disableClaimingPresale() public onlyOwner{
        isClaimingPresale = false;
    }

    function buyInPresale() public payable {
        require(isPresale, "Presale not started yet or done");
        require(!presaleEnded, "Presale Ended");
        if(!isOpenForPublic){
            require(isWhitelisted[msg.sender], "Not whitelisted");
        }
        require(buyInPreSaleAmount[msg.sender] + msg.value <= maxBuy, "you already reached max buy in presale");
        require(totalBuy + msg.value <= hardCap, "presale sold out");
        require(msg.value > 0, "BNB amount must be more then 0");

        buyInPreSaleAmount[msg.sender] += msg.value ;
        totalBuy += msg.value;
        isJoinedPresale[msg.sender] = true;
        emit BoughtInPresale(msg.sender, msg.value);

        if(totalBuy >= hardCap){
            _endPresale();
        }

    }

    function _tokenAmountCalcu(uint _senderAmount) internal view returns (uint){
        uint256 tokenAmount = (_senderAmount * tokensForPresale / totalBuy) * 10 ** 18;
        return tokenAmount;
    }

    function claimTokens() public {
        require(isJoinedPresale[msg.sender], "Did not join the presale");
        require(isClaimingPresale, "Can't claim now");
        require(!claimedPresaleToken[msg.sender], "already claimed tokens");

        uint tokenAmount = _tokenAmountCalcu(buyInPreSaleAmount[msg.sender]);
        claimedPresaleToken[msg.sender] = true;

        _basicTransfer(owner(), msg.sender, tokenAmount);
        emit TokensClaimed(msg.sender);
    }


    function openPublic() public onlyOwner{
        isOpenForPublic = true;

        emit PublicOpend();
    }

    function addToWhiteList(address[] memory whitelist) public onlyOwner {
        for(uint i = 0; i < whitelist.length; i++){
            isWhitelisted[whitelist[i]] = true;
        }
    }

    function removeFromWhiteList(address[] memory whitelist) public onlyOwner{
        for(uint i = 0; i < whitelist.length; i++){
            isWhitelisted[whitelist[i]] = false;
        }
    }

    function burn(uint amount)public onlyOwner{
        _basicTransfer(owner(), deadAddress, amount);
    }
    
    function withdraw() public onlyOwner{
        (bool success, ) = payable(owner()).call{value : address(this).balance}('');
        require(success, "withdraw failed");
    }
}