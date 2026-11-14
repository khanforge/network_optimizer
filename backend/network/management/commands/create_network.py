from network.models import Node, Edge
from django.db import transaction
from django.core.management.base import BaseCommand
# Clear existing test data

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            "--confirm",
            action="store_true",
            help="Confirm deletion of existing graph data.",
        )

    def delete_existing_graph(self):
        Edge.objects.all().delete()
        Node.objects.all().delete()

    def create_graph(self):
        node_names = ["Server A", "Server B", "Server C", "Server D", "Server E", "Server F", "Server G", "Server H"]

        self.nodes = {
            name: Node.objects.create(name=name)
            for name in node_names
        }

        self.edges = [
            ("Server A", "Server B", 4),
            ("Server A", "Server C", 2),
            ("Server B", "Server C", 1),
            ("Server B", "Server D", 5),
            ("Server C", "Server D", 8),
            ("Server C", "Server E", 10),
            ("Server D", "Server E", 2),
            ("Server D", "Server F", 6),
            ("Server E", "Server F", 3),
            ("Server E", "Server G", 7),
            ("Server F", "Server H", 2),
            ("Server G", "Server H", 1),
        ]

        Edge.objects.bulk_create([
            Edge(
                source=self.nodes[source],
                destination=self.nodes[destination],
                latency=latency
            )
            for source, destination, latency in self.edges
        ])
    @transaction.atomic
    def handle(self, *args, **options):
        if not options["confirm"]:
            self.stdout.write(
                self.style.WARNING(
                    "This command will delete existing graph data."
                )
            )
            self.stdout.write("Run with --confirm to proceed.")
            return

        self.delete_existing_graph()
        self.create_graph()
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {len(self.nodes)} nodes and {len(self.edges)} edges."
            )
        )


