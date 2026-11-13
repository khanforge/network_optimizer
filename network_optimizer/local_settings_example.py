# run ```cp local_settings_example.py local_settings.py```
SECRET_KEY = "replace-me"
DEBUG = False

ALLOWED_HOSTS = []

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
