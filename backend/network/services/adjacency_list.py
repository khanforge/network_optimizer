from network.models import Edge
from collections import defaultdict

class AdjacencyList:
   def __init__(self):
      self.graph = defaultdict(list)
      self.edges = Edge.objects.values_list(
         "source_id",
         "destination_id",
         "latency"
      )

      for source, destination, latency in self.edges:
               self.graph[source].append((destination, latency))      

   def get_graph(self):
      return self.graph