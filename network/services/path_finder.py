from network.models import Node, Edge
from heapq import heappop, heappush
from decimal import Decimal

class PathFinder:
   def __init__(self, source, destination, graph):
      self.source, self.destination = None, None
      self.resolve_source_destination(source, destination)

      if not self.destination or not self.source:
         raise ValueError(
            "Destination and source are not valid"
         )
         
      
      self.adjacency_list = graph
      self.path = list()
      self.total_latency = 0

   def resolve_source_destination(self, source, destination):
      if isinstance(source, int) and isinstance(destination, int):
         self.source = source
         self.destination = destination
      elif isinstance(source, str) and isinstance(destination, str):
         nodes = Node.objects.in_bulk(
            [source, destination],
            field_name="slug"
         )

         source_node = nodes.get(source)
         destination_node = nodes.get(destination)

         if source_node is None or destination_node is None:
            nodes = Node.objects.in_bulk(
               [source, destination],
               field_name="name"
            )
            source_node = nodes.get(source)
            destination_node = nodes.get(destination)
            
         if source_node is None or destination_node is None:
            raise ValueError("Invalid source or destination")

         self.source = source_node.id
         self.destination = destination_node.id
      else:
         raise ValueError("source or destination must either id or slug")

   def search(self):
      distance = {
         self.source: Decimal("0")
      }
      pq = [
         (Decimal("0"), self.source)
      ]
      previous = dict()
      while pq:
         current_latency, current_node = heappop(pq)
         if current_latency > distance.get(current_node, Decimal("inf")):
            continue

         if current_node == self.destination:
            break

         for neighbour_node, neighbour_latency in self.adjacency_list[current_node]:
            new_distance = current_latency + neighbour_latency
            if new_distance < distance.get(neighbour_node, Decimal("inf")):
               distance[neighbour_node] = new_distance
               heappush(pq, (new_distance, neighbour_node))
               previous[neighbour_node]=current_node

      if self.destination not in distance:
         return None

      self.path = [self.destination]

      while self.path[-1] != self.source:
         self.path.append(previous[self.path[-1]])

      for node in self.path:
         self.total_latency += distance[node]

      self.path.reverse()

      return self.get_path()

   def get_path(self):
      return {
         "path": self.path,
         "total_latency": self.total_latency
      }

      
"""
from network.services.adjacency_list import AdjacencyList
from network.services.path_finder import PathFinder
graph = AdjacencyList().get_graph()
finder = PathFinder(53, 60, graph)
finder.search()
"""

   
