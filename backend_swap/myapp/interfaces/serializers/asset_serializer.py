from rest_framework import serializers
from ...domain.models.asset import Asset

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'
