from rest_framework import serializers
from .models import Node, Edge, RouteHistory

class NodeSerializer(serializers.ModelSerializer):
   class Meta:
      model = Node
      fields = "__all__"
      read_only_fields = ['id', 'slug', 'created_at', 'modified_at']

class EdgeSerializer(serializers.ModelSerializer):
   source = serializers.SlugRelatedField(
      slug_field="slug",
      queryset = Node.objects.all()
   )
   destination = serializers.SlugRelatedField(
      slug_field="slug",
      queryset = Node.objects.all()
   )
   class Meta:
      model = Edge
      fields = "__all__"
      read_only_fields = ['id', 'created_at', 'modified_at']

   def validate_latency(self, value):
      if value<=0:
         raise serializers.ValidationError(
            "Latency must be positive"
         )
      return value

   def validate(self, attrs):
      source = attrs.get("source")
      destination = attrs.get("destination")

      if source == destination:
         raise serializers.ValidationError(
            "Source and Destination must be different."
         )

      if Edge.objects.filter(
         source=source,
         destination=destination
      ).exists():
         raise serializers.ValidationError(
            "An edge already exists between these nodes."
         )
      return attrs

class RouteHistorySerializer(serializers.ModelSerializer):
   source = serializers.SlugRelatedField(
         slug_field="slug",
         queryset = Node.objects.all()
      )
   destination = serializers.SlugRelatedField(
      slug_field="slug",
      queryset = Node.objects.all()
   )
   
   class Meta:
      model = RouteHistory
      fields = "__all__"
      read_only_fields = ['id', 'created_at', 'modified_at']


   