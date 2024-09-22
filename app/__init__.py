from flask import Flask
from app.routes.data_routes import data_routes
from app.routes.web_routes import web_routes
from dotenv import load_dotenv
import os
import openai

# Cargar variables de entorno desde el archivo .env
load_dotenv()

def create_app():
    app = Flask(__name__, static_folder='static')

    # Configurar la API Key de OpenAI
    openai.api_key = os.getenv('OPENAI_API_KEY')

    # Registrar blueprints (rutas)
    app.register_blueprint(data_routes)  # Registrar el blueprint para las rutas de datos
    app.register_blueprint(web_routes)   # Registrar el blueprint para las rutas de HTML (web)

    return app
