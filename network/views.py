from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import Node, Edge, RouteHistory
from .serializers import NodeSerializer, EdgeSerializer
# Create your views here.

class NodeModelViewSet(ModelViewSet):
   queryset = Node.objects.all().order_by("-modified_at")
   serializer_class = NodeSerializer


class EdgeModelViewSet(ModelViewSet):
   queryset = Edge.objects.select_related(
      "source",
      "destination"
   ).all().order_by("-modified_at")
   serializer_class = EdgeSerializer
