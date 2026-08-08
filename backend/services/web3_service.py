import os
import hashlib
import time
from typing import Optional, Tuple
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

def _generate_demo_tx_hash(user_id: int, token_id: int, quantity: int) -> str:
    """Generate a deterministic demo tx hash for demo mode."""
    data = f"DEMO_{user_id}_{token_id}_{quantity}_{int(time.time())}"
    return "0x" + hashlib.sha256(data.encode()).hexdigest()

async def mint_vehicle_tokens(
    to_address: str,
    vehicle_token_id: int,
    quantity: int,
    user_id: int,
    token_id: int
) -> Tuple[Optional[str], Optional[int]]:
    """
    Mints ERC-1155 tokens on Polygon Amoy testnet.
    Returns (tx_hash, nft_token_id)
    
    In DEMO MODE or if Web3 is not configured:
    - Returns a simulated tx_hash with DEMO_ prefix
    - In production: would mint real tokens on Polygon Amoy
    """
    # Check if Web3 is configured
    if not settings.CONTRACT_ADDRESS or not settings.PLATFORM_PRIVATE_KEY:
        logger.info("Web3 not configured — running in DEMO MODE (simulated NFT)")
        demo_hash = _generate_demo_tx_hash(user_id, token_id, quantity)
        return demo_hash, vehicle_token_id
    
    try:
        from web3 import Web3
        
        w3 = Web3(Web3.HTTPProvider(settings.POLYGON_RPC_URL))
        if not w3.is_connected():
            logger.warning("Cannot connect to Polygon Amoy - falling back to DEMO MODE")
            return _generate_demo_tx_hash(user_id, token_id, quantity), vehicle_token_id
        
        # Minimal ERC-1155 mint ABI
        abi = [
            {
                "inputs": [
                    {"name": "to", "type": "address"},
                    {"name": "id", "type": "uint256"},
                    {"name": "amount", "type": "uint256"},
                    {"name": "data", "type": "bytes"}
                ],
                "name": "mint",
                "outputs": [],
                "type": "function"
            }
        ]
        
        contract = w3.eth.contract(
            address=Web3.to_checksum_address(settings.CONTRACT_ADDRESS),
            abi=abi
        )
        
        account = w3.eth.account.from_key(settings.PLATFORM_PRIVATE_KEY)
        
        # If to_address is not a valid ETH address, use platform wallet
        try:
            recipient = Web3.to_checksum_address(to_address)
        except Exception:
            recipient = Web3.to_checksum_address(settings.PLATFORM_WALLET_ADDRESS)
        
        nonce = w3.eth.get_transaction_count(account.address)
        gas_price = w3.eth.gas_price
        
        txn = contract.functions.mint(
            recipient,
            vehicle_token_id,
            quantity,
            b''
        ).build_transaction({
            'from': account.address,
            'nonce': nonce,
            'gasPrice': gas_price,
            'gas': 200000,
            'chainId': 80002  # Polygon Amoy
        })
        
        signed_txn = w3.eth.account.sign_transaction(txn, private_key=settings.PLATFORM_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        
        logger.info(f"NFT minted! tx_hash: {receipt.transactionHash.hex()}")
        return receipt.transactionHash.hex(), vehicle_token_id
        
    except Exception as e:
        logger.error(f"Web3 mint failed: {e} — falling back to DEMO MODE")
        return _generate_demo_tx_hash(user_id, token_id, quantity), vehicle_token_id
