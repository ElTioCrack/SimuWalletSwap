from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...application.use_cases.create_order import execute as create_order
from ..serializers.order_serializer import OrderSerializer

class OrderCreateView(APIView):
    def post(self, request):
        asset_symbol = request.data.get('asset_symbol')
        amount = request.data.get('amount')

        if not asset_symbol or not amount:
            return Response({"error": "asset_symbol and amount are required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            amount = float(amount)
        except ValueError:
            return Response({"error": "amount must be a number"}, status=status.HTTP_400_BAD_REQUEST)

        result = create_order(asset_symbol, amount)
        if "error" in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        order = result.get("order")
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
