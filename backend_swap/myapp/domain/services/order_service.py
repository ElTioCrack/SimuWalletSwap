from ..models.order import Order
from ..models.asset import Asset

def create_order(asset_symbol, amount, price):
    try:
        asset = Asset.objects.get(symbol=asset_symbol)
        order = Order.objects.create(asset=asset, amount=amount, price=price, status='created')
        return order
    except Asset.DoesNotExist:
        return None
