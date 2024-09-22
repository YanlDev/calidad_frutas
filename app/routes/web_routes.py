from flask import Blueprint, render_template

# Blueprint para las rutas de la web (renderización de HTML)
web_routes = Blueprint('web_routes', __name__)

# Ruta para mostrar la página principal
@web_routes.route('/')
def index():
    return render_template('index.html')

@web_routes.route('/analisis', methods=['GET'])
def analytics_page():
    return render_template('analytics.html')
