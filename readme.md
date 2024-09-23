# Calidad del Aguaymanto - Sistema de Evaluación y Análisis

Este proyecto tiene como finalidad evaluar la calidad de frutas (aguaymanto) a través de parámetros como los grados Brix, la temperatura, el tamaño, el color y las condiciones visuales de la fruta. El sistema permite cargar los datos de manera manual o a través de un archivo Excel, y genera un análisis detallado y recomendaciones automatizadas mediante la API de OpenAI.

## Características

- **Ingreso Manual de Datos:** Los usuarios pueden ingresar los grados Brix, temperatura, tamaño y evaluación visual de la fruta para su análisis.
- **Carga de Archivos Excel:** El sistema soporta la carga de archivos Excel que contienen datos de múltiples frutas para análisis masivos.
- **Análisis de Tendencias:** Se generan gráficos para visualizar la tendencia de grados Brix y temperatura a lo largo de varias muestras.
- **Detección de Outliers:** Se detectan valores atípicos en los datos de tamaño mediante análisis de rango intercuartílico (IQR).
- **Análisis de Variabilidad:** Se analiza la variabilidad en los datos de grados Brix, temperatura, color y defectos visuales.
- **Correlaciones entre Variables:** El sistema analiza la relación entre diferentes parámetros, como la correlación entre grados Brix y temperatura.
- **Segmentación de Calidad:** Las frutas son segmentadas en tres categorías (alta, media y baja) según sus características.
- **Interpretaciones Automáticas:** El sistema usa la API de OpenAI para generar interpretaciones y recomendaciones sobre la calidad de la fruta y su almacenamiento.
- **Exportación de Resultados a PDF:** Los resultados del análisis pueden ser exportados a un archivo PDF para compartir o archivar.

## Estructura del Proyecto

```bash
.
├── app
│   ├── models
│   │   ├── analysis_manager.py   # Lógica para los análisis de datos
│   │   ├── data_manager.py       # Gestión de datos (guardar/cargar)
│   │   └── interpretation_manager.py  # Lógica para las interpretaciones con OpenAI
│   ├── routes
│   │   ├── data_routes.py        # Rutas para gestionar los datos
│   │   └── web_routes.py         # Rutas para gestionar las páginas web
│   ├── static
│   │   └── css
│   │       ├── input.css         # Estilos personalizados de Tailwind CSS
│   │       └── output.css
│   ├── templates
│   │   ├── index.html            # Página principal para ingresar datos
│   │   └── analytics.html        # Página de resultados y análisis
├── instance
│   ├── datos.json                # Archivo donde se guardan temporalmente los datos para análisis
│   └── uploads                   # Directorio donde se almacenan archivos subidos
├── .env                          # Archivo para las variables de entorno
├── requirements.txt              # Dependencias del proyecto
├── tailwind.config.js            # Configuración de Tailwind CSS
├── app.py                        # Archivo principal para iniciar la aplicación Flask
└── README.md                     # Este archivo
```

## Clona el repositorio 
``git clone https://github.com/tu-usuario/tu-repo.git``
``cd tu-repo``

## Crear un Entorno Virtual e Instalar Dependencias
``python -m venv .venv``
``source .venv/bin/activate  # En Windows: .venv\Scripts\activate``
``pip install -r requirements.txt``

## Configurar Variables de Entorno
``OPENAI_API_KEY=tu_clave_de_api_de_openai``
``FLASK_ENV=development``



Introducción
  Descripción General
  Público Objetivo
  Requisitos del Sistema
Guía de Instalación
  Requisitos Previos
  Pasos para la Instalación
  Resolución de Problemas de Instalación
Descripción de la Interfaz de Usuario
  Pantalla Principal
  Explicación de Íconos y Funciones
  Ejemplos Visuales
Guía de Uso
  Flujo de Trabajo Básico
  Funciones Principales
  Ejemplos de Uso
Resolución de Problemas Comunes
  Errores Comunes y Soluciones
  FAQ (Preguntas Frecuentes)

Soporte Técnico y Contacto

Licencia

