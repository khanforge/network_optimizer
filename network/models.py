from django.db import models
from django.utils.text import slugify
from common.models import AbstractTimeModel

# Create your models here.

class Node(AbstractTimeModel):
   name = models.CharField(
      unique=True,
      max_length=100
   )
   slug = models.SlugField(
      unique=True,
      max_length=150,
      blank=True
   )

   def __str__(self):
      return f"node-{self.name}"

   def save(self, *args, **kwargs):
      if not self.slug:
         self.slug = slugify(self.name)
      super().save(*args, **kwargs)

class Edge(AbstractTimeModel):
   source = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="outgoing_edges")
   destination = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="incoming_edges")
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
            name = "positive_latency"
         )
      ]
      indexes = [
         models.Index(fields=["source"]),
      ]

   def __str__(self):
      return f"edge:{self.source.name}->{self.destination.name}"


class RouteHistory(AbstractTimeModel):  
   source = models.ForeignKey(Node, on_delete=models.PROTECT, related_name="route_sources")
   destination = models.ForeignKey(Node, on_delete=models.PROTECT, related_name="route_destinations")
   total_latency = models.DecimalField(
            max_digits=12,
         decimal_places=3
      )
   path = models.JSONField()

   class Meta:
      ordering = ["-modified_at"]

   def __str__(self):
      return f"route:{self.source.name}->{self.destination.name}"
         