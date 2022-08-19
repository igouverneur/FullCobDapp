// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TryNFT is ERC721Enumerable, Ownable {
    bool public isInGameMintEnable;
    bool public isPublicMintEnable;
    bool public paused;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    uint256 public mintPrice;
    string internal baseUri;

    // mapping tokenId to the number of times a Player allowed to mint in game
    mapping(uint256 => uint256) public isAllowedToMintInGame;
    // mapping tokenId to the number of times a Player mint in game
    mapping(uint256 => uint256) public mintCountInGame;
    // mapping wallet address to the number of times mint in public sell
    mapping(address => uint256) public mintsWallet;
    // mapping tokenId to a bool if a Player is banned from the game for some reason cheating for example
    // banning a player from the game his nft is no longer valid to login
    mapping(uint256 => bool) public isBannedPlayer;

    uint256[] public tokensIdsMintedInGame;

    event publicMintingEnabled();
    event publicMintingDisabled();
    event playerRewarded(uint256 indexed playerId);
    event playerMintedReward(uint256 indexed playerId, uint256 indexed tokenId);
    event playerBanned(uint256 indexed playerId);
    event playerUnBanned(uint256 indexed playerId);
    event mintedInPublicSale(address indexed wallet, uint256 quantity);

    constructor(string memory _name, string memory _symbol, string memory _baseUri, uint _maxSupply, uint _mintPrice) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        maxPerWallet = 100;
        mintPrice = _mintPrice;
        baseUri= _baseUri;
        mintInPublic(1);    
    }

    // Public sale mint function with max buy per wallet 100 NFT.
    function mintInPublic(uint256 _quantity) public payable {
        //this is for 1 time use to mint 1NFT, owner will never use this function again
        if(msg.sender == owner()){
            uint256 tokenId = totalSupply() + 1;
            mintsWallet[msg.sender] += 1;
            _safeMint(msg.sender, tokenId);
            return;
        }
                require(isPublicMintEnable, "public sell not started yet");
                require(!paused, "contract is paused");
                require(msg.value == mintPrice * _quantity, " wrong value");
                require(totalSupply() + _quantity <= maxSupply, "you reached max supply");
                require(mintsWallet[msg.sender] + _quantity <= maxPerWallet, "you cannot mint more then 100NFT");
                require(_quantity > 0, "quanatity is 0");

                for(uint i = 0; i < _quantity; i++){
                    uint256 tokenId = totalSupply() + 1;
                    mintsWallet[msg.sender] += 1;
                    _safeMint(msg.sender, tokenId);
                }

                emit mintedInPublicSale(msg.sender, _quantity);
        
        }
    // this function can be called by the players who are eligible to mint their rewards for free.
    function mintInGame(uint256 _playerId) public {
        require(isInGameMintEnable, "in game mint not enabled yet");
        require(isAllowedToMintInGame[_playerId] > 0, " you are not eligible for rewards");
        require(ownerOf(_playerId) == msg.sender, "wrong player");
        require(!paused, "contract is paused");
        require(totalSupply() + 1 <= maxSupply, "you reached max supply");

        uint256 tokenId = totalSupply() + 1;
        mintCountInGame[_playerId] += 1;
        _safeMint(msg.sender, tokenId);
        
        tokensIdsMintedInGame.push(tokenId);
        isAllowedToMintInGame[_playerId] -= 1;
        emit playerMintedReward(_playerId, tokenId);
    }
    function tokenURI(uint256 _tokenId) public view override returns(string memory){
        require(_exists(_tokenId), "token id does not exist");
        return string(baseUri);
    }
    function allTokensIdsMintedInGame() public view returns(uint256[] memory){
        return tokensIdsMintedInGame;
    }
    function ownerTokenIds(address _owner) public view returns(uint[] memory){
        uint256[] memory tokenIds = new uint256[](balanceOf(_owner));
        for(uint i = 0; i < balanceOf(_owner) ; i++){
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }
    //onlyOwner
    function setBaseUri(string memory _baseUri) external onlyOwner{
        baseUri = _baseUri;
    }

    // this function will only be called when the game needs to extand the number of players in the server
    function setMaxSupply(uint _maxSupply) external onlyOwner{
        require(_maxSupply >= totalSupply(), "max supply can't be less then total supply");
        maxSupply = _maxSupply;
    }   

    function setMintPrice(uint256 _mintPrice) external onlyOwner {
        mintPrice = _mintPrice;
    }
    function setMaxPerWallet(uint256 _maxPerWallet) external onlyOwner {
        maxPerWallet = _maxPerWallet;
    }

    function banPlayer(uint256 _playerId) public onlyOwner {
        require(isBannedPlayer[_playerId] == false, "Player already banned");
        isBannedPlayer[_playerId] = true ;
        emit playerBanned(_playerId);
    }
    function unBanPlayer(uint256 _playerId) public onlyOwner{
        require(isBannedPlayer[_playerId] == true, "This player is not banned");
        isBannedPlayer[_playerId] = false ;
        emit playerUnBanned(_playerId);
    }

    function setIsInGameMintEnable(bool _isInGameMintEnable) public onlyOwner{
        isInGameMintEnable = _isInGameMintEnable;
    }
    function setIsPublicMintEnable(bool _isPublicMintEnable) public onlyOwner{
        isPublicMintEnable = _isPublicMintEnable;
        if(_isPublicMintEnable == true){
            emit publicMintingEnabled();
        }
        else{
            emit publicMintingDisabled();
        }
    }
    function pause(bool _paused) public onlyOwner{
        paused = _paused;
    }

    function giveReward(uint _playerId) public onlyOwner{
        isAllowedToMintInGame[_playerId] += 1 ;
        emit playerRewarded(_playerId);
    }
    function withdraw() public onlyOwner{
        (bool success, ) = payable(owner()).call{value : address(this).balance}('');
        require(success, "withdraw failed");
    }

    fallback() external payable {}
    receive() external payable {}
    }