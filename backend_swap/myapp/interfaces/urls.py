from django.urls import path
from .controllers.asset_controller import AssetListView, AssetPriceView
from .controllers.order_controller import OrderCreateView

urlpatterns = [
    path('assets/', AssetListView.as_view(), name='assets-list'),
    path('assets/<str:symbol>/price/', AssetPriceView.as_view(), name='asset-price'),
    path('orders/', OrderCreateView.as_view(), name='orders-create'),
]
