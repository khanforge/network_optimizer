from django.shortcuts import render
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import Node, Edge, RouteHistory
from .serializers import NodeSerializer, EdgeSerializer, RouteHistorySerializer
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
            status=status.HTTP_400_BAD_REQUEST
         )

      nodes_obj = Node.objects.filter(
         id__in = route['path']
      )

      nodes = NodeSerializer(nodes_obj, many=True).data

      RouteHistory.objects.create(
         source_id=route['path'][0],
         destination_id=route['path'][-1],
         total_latency = route['total_latency'],
         path=nodes
      )

      return Response({
            "data":{
               "path": nodes,
               "total_latency": route['total_latency']
            }
         },
         status.HTTP_200_OK
      )

class RouteHistoryAPIView(APIView):
   def get(self, request, *args, **kwargs):
      source = request.query_params.get("source")
      destination =  request.query_params.get("destination")
      limit =  request.query_params.get("limit")
      date_from =  request.query_params.get("date_from")
      date_to =  request.query_params.get("date_to")

      try:
         limit = int(request.query_params.get("limit"))
      except (TypeError, ValueError):
         limit = 10

      q = Q()
      if source:
         q &= Q(source_id = source) if isinstance(source, int) else Q(source__slug = source)

      if destination:
         q &= Q(destination_id = destination) if isinstance(destination, int) else Q(destination__slug = destination)

      if date_from:
         q &= Q(created_at__gte = date_from)

      if date_to:
         q &= Q(created_at__lte = date_to)

      limit = max(1, min(limit, 50))
      history_objs = RouteHistory.objects.select_related(
         "source",
         "destination"
      ).filter(q).order_by("-modified_at")[:limit]

      history = RouteHistorySerializer(history_objs, many=True).data

      return Response({
         "data": history
      }, status=status.HTTP_200_OK)

      

