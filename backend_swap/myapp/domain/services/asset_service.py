from ..models.asset import Asset

def get_all_assets():
    return Asset.objects.all()

def get_asset_price(symbol):
    try:
        asset = Asset.objects.get(symbol=symbol)
        price = 100.0  # Ejemplo de precio fijo
        return price
    except Asset.DoesNotExist:
        return None
