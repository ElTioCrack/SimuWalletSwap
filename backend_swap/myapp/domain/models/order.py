from django.db import models
from .asset import Asset

class Order(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.asset.symbol} - {self.amount} @ {self.price}"
