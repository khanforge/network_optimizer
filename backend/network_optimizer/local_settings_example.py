# run ```cp local_settings_example.py local_settings.py```
SECRET_KEY = "replace-me"
DEBUG = False

ALLOWED_HOSTS = []

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React development server
    "http://localhost:8080",  # Vue development server
    "http://127.0.0.1:3000",  # Alternative localhost format
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "database_name",
        "USER": "database_user",
        "PASSWORD": "database_password",
        "HOST": "127.0.0.1",
        "PORT": "3306",
    }
}
