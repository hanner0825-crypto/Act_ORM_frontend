import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

class Config:
    USER = 'root'
    PASSWORD = ''
    HOST = 'localhost'
    DATABASE = 'db_products'

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f'mysql+pymysql://{USER}:{PASSWORD}@{HOST}/{DATABASE}'
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    if os.environ.get("DATABASE_URL"):
        SQLALCHEMY_ENGINE_OPTIONS = {
            "connect_args": {
                "ssl": {"ca": os.environ.get("SSL_CA", os.path.join(BASE_DIR, "ca.pem"))}
            }
        }