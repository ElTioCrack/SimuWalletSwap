from ...domain.services.asset_service import get_asset_price

def execute(symbol):
    price = get_asset_price(symbol)
    if price is not None:
        return {"symbol": symbol, "price": price}
    return {"error": "Asset not found"}
