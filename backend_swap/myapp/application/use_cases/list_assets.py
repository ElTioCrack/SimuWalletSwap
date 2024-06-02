from ...domain.services.asset_service import get_all_assets

def execute():
    assets = get_all_assets()
    return assets
