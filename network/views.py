from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Node, Edge, RouteHistory
from .serializers import NodeSerializer, EdgeSerializer
from network.services.adjacency_list import AdjacencyList
from network.services.path_finder import PathFinder
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

class ShortestRouteAPIView(APIView):
   def post(self, request, *args, **kwargs):
      source = request.data.get("source")
      destination = request.data.get("destination")

      network = AdjacencyList().get_graph()

      try:
         route = PathFinder(source, destination, network).search()
      except ValueError:
         return Response(
            {
               "error": f"Invalid source: {source} or destination: {destination}"
            },
            status=status.HTTP_404_NOT_FOUND
         )

      if route is None:
         return Response({
               "error": f"No path exists between {source} and {destination}"
            },
            status=status.HTTP_404_NOT_FOUND
         )

      nodes_obj = Node.objects.filter(
         id__in = route['path']
      )

      nodes = NodeSerializer(nodes_obj, many=True).data

      return Response({
            "data":{
               "path": nodes,
               "total_latency": route['total_latency']
            }
         },
         status.HTTP_200_OK
      )
