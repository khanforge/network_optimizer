from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Node, Edge
# Create your tests here.


class NodeAPITestCase(APITestCase):

   def setUp(self):
      self.url = reverse("nodes-list")

   def test_create_node(self):
      response = self.client.post(
         self.url,
         {
            "name": "Server A"
         },
         format="json"
      )
      self.assertEqual(response.status_code, status.HTTP_201_CREATED)
      self.assertEqual(response.data["name"], "Server A")
      self.assertEqual(response.data["slug"], "server-a")
      self.assertEqual(Node.objects.count(), 1)

   def test_duplicate_node(self):
      Node.objects.create(name="Server A")
      response = self.client.post(
         self.url,
         {
            "name": "Server A"
         },
         format="json"
      )
      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
      self.assertEqual(Node.objects.count(), 1)

   def test_list_nodes(self):
      Node.objects.create(name="Server A")
      Node.objects.create(name="Server B")
      response = self.client.get(self.url)

      self.assertEqual(response.status_code, status.HTTP_200_OK)
      self.assertEqual(len(response.data), 2)

class EdgeAPITestCase(APITestCase):
   def setUp(self):
      self.url = reverse("edges-list")
      self.node1 = Node.objects.create(name="Server A")
      self.node2 = Node.objects.create(name="Server B")


   def test_create_edge(self):
      response = self.client.post(
         self.url,
         {
            "source": self.node1.slug,
            "destination": self.node2.slug,
            "latency": "5.5"

         },
         format="json"
      )
      self.assertEqual(response.status_code, status.HTTP_201_CREATED)
      self.assertEqual(Edge.objects.count(), 1)

   def test_duplicate_edge(self):
      Edge.objects.create(
            source=self.node1,
            destination=self.node2,
            latency=5.5
        )
      response = self.client.post(
         self.url,
         {
            "source": self.node1.slug,
            "destination": self.node2.slug,
            "latency": "5.5"

         },
         format="json"
      )
      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
      self.assertEqual(Edge.objects.count(), 1)

   def test_nonexistent_node(self):
        response = self.client.post(
            self.url,
            {
                "source": "unknown-server",
                "destination": self.node1.slug,
                "latency": "5.5"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

   def test_self_loop(self):
      response = self.client.post(
         self.url,
         {
               "source": self.node1.slug,
               "destination": self.node1.slug,
               "latency": "5.5"
         },
         format="json"
      )

      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

   def test_invalid_latency(self):
      response = self.client.post(
         self.url,
         {
               "source": self.node1.slug,
               "destination": self.node2.slug,
               "latency": "0"
         },
         format="json"
      )

      self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

   def test_reverse_edge_is_allowed(self):
      Edge.objects.create(
            source=self.node1,
            destination=self.node1,
            latency=5
      )

      response = self.client.post(
            self.url,
            {
               "source": self.node1.slug,
               "destination": self.node2.slug,
               "latency": "8"
            },
            format="json"
      )

      self.assertEqual(response.status_code, status.HTTP_201_CREATED)
      self.assertEqual(Edge.objects.count(), 2)
