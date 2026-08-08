// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VaultWheelToken
 * @notice ERC-1155 semi-fungible token for VaultWheel vehicle fractional ownership
 * @dev Deploy on Polygon Amoy testnet via Remix IDE
 *      Each token ID corresponds to one vehicle (ID 1-10 for seed vehicles)
 *      Multiple holders can own different quantities of the same vehicle token
 *
 * DEPLOYMENT STEPS:
 * 1. Go to remix.ethereum.org
 * 2. Create this file and compile with Solidity 0.8.20
 * 3. Connect MetaMask to Polygon Amoy (Chain ID: 80002)
 *    RPC: https://rpc-amoy.polygon.technology
 * 4. Get free MATIC from faucet: https://faucet.polygon.technology
 * 5. Deploy this contract
 * 6. Copy the contract address to ZEROPS env var: CONTRACT_ADDRESS
 * 7. Copy your wallet private key to: PLATFORM_PRIVATE_KEY
 */

// Minimal ERC-1155 implementation (no OpenZeppelin dependency for easy Remix deploy)
abstract contract ERC1155 {
    mapping(uint256 => mapping(address => uint256)) private _balances;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);

    function balanceOf(address account, uint256 id) public view returns (uint256) {
        return _balances[id][account];
    }

    function balanceOfBatch(address[] memory accounts, uint256[] memory ids) public view returns (uint256[] memory) {
        require(accounts.length == ids.length, "ERC1155: accounts and ids length mismatch");
        uint256[] memory batchBalances = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }
        return batchBalances;
    }

    function setApprovalForAll(address operator, bool approved) public {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address account, address operator) public view returns (bool) {
        return _operatorApprovals[account][operator];
    }

    function _mint(address to, uint256 id, uint256 amount, bytes memory data) internal {
        require(to != address(0), "ERC1155: mint to the zero address");
        _balances[id][to] += amount;
        emit TransferSingle(msg.sender, address(0), to, id, amount);
    }

    function _mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal {
        require(to != address(0), "ERC1155: mint to the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        for (uint256 i = 0; i < ids.length; i++) {
            _balances[ids[i]][to] += amounts[i];
        }
        emit TransferBatch(msg.sender, address(0), to, ids, amounts);
    }

    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public {
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(from == msg.sender || isApprovedForAll(from, msg.sender), "ERC1155: caller is not owner nor approved");
        _balances[id][from] -= amount;
        _balances[id][to] += amount;
        emit TransferSingle(msg.sender, from, to, id, amount);
    }
}

contract VaultWheelToken is ERC1155 {
    address public owner;
    
    // Token ID => vehicle name
    mapping(uint256 => string) public vehicleNames;
    // Token ID => URI metadata
    mapping(uint256 => string) private _tokenURIs;
    // Token ID => total minted
    mapping(uint256 => uint256) public totalMinted;

    event TokensMinted(address indexed to, uint256 indexed vehicleTokenId, uint256 amount, string vehicleName);
    event VehicleRegistered(uint256 indexed tokenId, string vehicleName);

    modifier onlyOwner() {
        require(msg.sender == owner, "VaultWheel: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        
        // Pre-register the 10 seed vehicles
        _registerVehicle(1, "McLaren F1 1994");
        _registerVehicle(2, "Ferrari LaFerrari 2015");
        _registerVehicle(3, "Lamborghini Sesto Elemento 2012");
        _registerVehicle(4, "Ferrari Enzo 2003");
        _registerVehicle(5, "Pagani Huayra BC 2016");
        _registerVehicle(6, "Bugatti Veyron Super Sport 2010");
        _registerVehicle(7, "Koenigsegg Agera RS 2017");
        _registerVehicle(8, "Lexus LFA 2012");
        _registerVehicle(9, "Porsche Carrera GT 2004");
        _registerVehicle(10, "Mitsubishi Pajero Signature Edition 2020");
    }

    function _registerVehicle(uint256 tokenId, string memory vehicleName) internal {
        vehicleNames[tokenId] = vehicleName;
        emit VehicleRegistered(tokenId, vehicleName);
    }

    /**
     * @notice Mint vehicle ownership tokens to an investor
     * @param to Recipient address (investor's wallet or platform custodial wallet)
     * @param vehicleTokenId ERC-1155 token ID (1-10 for seed vehicles)
     * @param amount Number of fractional tokens to mint
     */
    function mint(
        address to,
        uint256 vehicleTokenId,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        require(vehicleTokenId >= 1 && vehicleTokenId <= 1000, "VaultWheel: invalid token ID");
        require(amount > 0 && amount <= 1000, "VaultWheel: invalid amount");
        
        _mint(to, vehicleTokenId, amount, data);
        totalMinted[vehicleTokenId] += amount;
        
        emit TokensMinted(to, vehicleTokenId, amount, vehicleNames[vehicleTokenId]);
    }

    /**
     * @notice Mint to multiple investors in one tx (gas optimization)
     */
    function mintBatch(
        address to,
        uint256[] memory vehicleTokenIds,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        _mintBatch(to, vehicleTokenIds, amounts, data);
    }

    /**
     * @notice Set token metadata URI
     */
    function setTokenURI(uint256 tokenId, string memory tokenURI) external onlyOwner {
        _tokenURIs[tokenId] = tokenURI;
        emit URI(tokenURI, tokenId);
    }

    function uri(uint256 tokenId) public view returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @notice Transfer ownership of the contract (for platform rotation)
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "VaultWheel: new owner is the zero address");
        owner = newOwner;
    }

    /**
     * @notice Register a new vehicle (for future listings beyond seed data)
     */
    function registerVehicle(uint256 tokenId, string memory vehicleName) external onlyOwner {
        require(bytes(vehicleNames[tokenId]).length == 0, "VaultWheel: vehicle already registered");
        _registerVehicle(tokenId, vehicleName);
    }
}
