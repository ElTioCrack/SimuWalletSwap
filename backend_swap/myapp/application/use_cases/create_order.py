from ...domain.services.order_service import create_order
from ...domain.services.asset_service import get_asset_price

def execute(asset_symbol, amount):
    price = get_asset_price(asset_symbol)
    if price is None:
        return {"error": "Asset not found"}
    order = create_order(asset_symbol, amount, price)
    if order:
        return {"message": "Order created successfully", "order": order}
    return {"error": "Could not create order"}
