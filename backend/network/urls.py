from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import NodeModelViewSet, EdgeModelViewSet, ShortestRouteAPIView, RouteHistoryAPIView

router = DefaultRouter()

router.register("nodes", NodeModelViewSet, basename="nodes")
router.register("edges", EdgeModelViewSet, basename="edges")

urlpatterns = router.urls

urlpatterns += [
   path("routes/shortest/", ShortestRouteAPIView.as_view(), name="shortest-route"),
   path("routes/history/", RouteHistoryAPIView.as_view(), name="history-routes"),
]