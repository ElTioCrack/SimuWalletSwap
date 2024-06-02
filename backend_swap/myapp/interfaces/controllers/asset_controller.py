from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...application.use_cases.list_assets import execute as list_assets
from ...application.use_cases.get_asset_price import execute as get_asset_price
from ..serializers.asset_serializer import AssetSerializer

class AssetListView(APIView):
    def get(self, request):
        assets = list_assets()
        serializer = AssetSerializer(assets, many=True)
        return Response(serializer.data)

class AssetPriceView(APIView):
    def get(self, request, symbol):
        result = get_asset_price(symbol)
        if "error" in result:
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        return Response(result)
