from django.db import models
from common.models import AbstractTimeModel
# Create your models here.

class Node(AbstractTimeModel):
   name = models.CharField(
      unique=True,
      max_length=100
   )

   def __str__(self):
      return f"node-{self.name}"

class Edge(AbstractTimeModel):
   source = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="outgoing_edge")
   destination = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="incoming_edge")
   latency = models.DecimalField(
         max_digits=12,
        decimal_places=3
   )

   class Meta:
      constraints = [
         models.UniqueConstraint(
            fields=['source', 'destination'],
            name = "unique_directed_edge"
         ),
         models.CheckConstraint(
            condition=models.Q(latency__gt = 0),
            name = "positve_latency"
         )
      ]
      indexes = [
         models.Index(fields=["source"]),
      ]

   def __def__(self):
      return f"edge:-{self.source.name}->{self.destination.name}"

class RouteHistory(AbstractTimeModel):
   source = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="route_sources")
   destination = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="route_destination")
   total_latency = models.DecimalField(
            max_digits=12,
         decimal_places=3
      )
   path = models.JSONField()

   class Meta:
      ordering = ["-modified_at"]

   def __def__(self):
      return f"route:-{self.source.name}->{self.destination.name}"