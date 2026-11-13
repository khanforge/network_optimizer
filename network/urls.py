from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import NodeModelViewSet, EdgeModelViewSet

router = DefaultRouter()

router.register("nodes", NodeModelViewSet, basename="nodes")
router.register("edges", EdgeModelViewSet, basename="edges")

urlpatterns = router.urls

