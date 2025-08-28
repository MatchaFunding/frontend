import pandas as pd
import requests
import json
import re
import os
from datetime import datetime

API = "http://localhost:11434/api/generate"
MODEL = "gemma3:1b"
# MODEL = "gemma3:latest" # Este es de 4b, es un poco más pesado

BASE_DIR = os.path.dirname(__file__)

CSV_SUCIOS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "sucios", "csvs"))
CSV_LIMPIOS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "..", "limpios", "csvs"))
os.makedirs(CSV_LIMPIOS_DIR, exist_ok=True)

CAMPOS_OBJETIVO = [
    "Titulo", "Financiador", "Alcance", "Descripcion", "FechaDeApertura", "FechaDeCierre",
    "DuracionEnMeses", "Beneficios", "Requisitos", "MontoMinimo", "MontoMaximo", "Estado",
    "TipoDeBeneficio", "TipoDePerfil", "EnlaceDelDetalle", "EnlaceDeLaFoto"
]

DATASETS = {
    "ANID": {
        "input": os.path.join(CSV_SUCIOS_DIR, "abiertos-anid.csv"),
        "output": os.path.join(CSV_LIMPIOS_DIR, "abiertos-anid-limpio.csv"),
        "template": lambda row: (
            f"{row.get('Nombre del fondo','')}\n"
            f"{row.get('Subdirección','')}\n"
            f"Inicio: {row.get('Inicio','')}\n"
            f"Cierre: {row.get('Cierre','')}\n"
            f"Fallo: {row.get('Fallo','')}\n"
            f"Presentación: {row.get('presentacion','')}\n"
            f"Público objetivo: {row.get('publico_objetivo','')}\n"
            f"Bitácora: {row.get('bitacora','')}\n"
            f"Documentos: {row.get('documentos','')}\n"
            f"Enlace: {row.get('url','')}\n"
            f"Imagen: {row.get('url_imagen','')}"
        )
    },
    "CORFO": {
        "input": os.path.join(CSV_SUCIOS_DIR, "abiertos-corfo.csv"),
        "output": os.path.join(CSV_LIMPIOS_DIR, "abiertos-corfo-limpio.csv"),
        "template": lambda row: (
            f"{row.get('nombre','')}\n"
            f"Apertura: {row.get('apertura','')}\n"
            f"Cierre: {row.get('cierre','')}\n"
            f"Alcance: {row.get('alcance','')}\n"
            f"Descripción: {row.get('descripcion','')}\n"
            f"Beneficio: {row.get('beneficio','')}\n"
            f"Enlace: {row.get('url','')}"
        )
    },
    "FondosGob": {
        "input": os.path.join(CSV_SUCIOS_DIR, "abiertos-fondosgob.csv"),
        "output": os.path.join(CSV_LIMPIOS_DIR, "abiertos-fondosgob-limpio.csv"),
        "template": lambda row: (
            f"{row.get('nombre','')}\n"
            f"Entidad: {row.get('entidad','')}\n"
            f"Alcance: {row.get('alcance','')}\n"
            f"Beneficiarios: {row.get('beneficiarios','')}\n"
            f"Fecha inicio: {row.get('fecha_inicio','')}\n"
            f"Fecha fin: {row.get('fecha_fin','')}\n"
            f"Monto: {row.get('monto','')}\n"
            f"Postulación inicio: {row.get('postulacion_inicio','')}\n"
            f"Postulación cierre: {row.get('postulacion_cierre','')}\n"
            f"Resultados: {row.get('resultados','')}\n"
            f"Firma convenios: {row.get('firma_convenios','')}\n"
            f"Categoría: {row.get('categoria','')}\n"
            f"Descripción: {row.get('descripcion','')}\n"
            f"Enlace: {row.get('url_detalle','')}"
        )
    }
}


def extraer_json_puro(texto):
    """Extrae el primer objeto JSON del texto (si lo hay)."""
    match = re.search(r"(\{.*\})", texto, re.DOTALL)
    return match.group(1) if match else None


def calcular_estado(fecha_apertura, fecha_cierre):
    """Determina el estado del fondo en base a la fecha actual."""
    hoy = datetime.today().date()

    try:
        apertura = datetime.strptime(str(fecha_apertura), "%Y-%m-%d").date() if fecha_apertura else None
        cierre = datetime.strptime(str(fecha_cierre), "%Y-%m-%d").date() if fecha_cierre else None
    except Exception:
        return "EVA"  # fallback si las fechas vienen mal

    if apertura and hoy < apertura:
        return "PRX"  # Próximo
    if apertura and cierre and apertura <= hoy <= cierre:
        return "ABI"  # Abierto
    if cierre and hoy > cierre:
        return "CER"  # Cerrado

    return "EVA"  # fallback


def estructurar_fondo(texto):
    """Llama a Ollama para convertir el texto en el JSON con CAMPOS_OBJETIVO."""
    prompt = f"""
Eres un asistente que siempre responde solo con JSON puro, sin explicaciones ni razonamientos.

Extrae la información solicitada del siguiente texto de un fondo concursable. La respuesta debe ser únicamente un objeto JSON válido, sin explicaciones, sin razonamientos y completamente en español. No debes alterar los nombres de los campos, ni agregar campos adicionales.

Debes seguir estas reglas estrictamente:
- La salida debe ser un **objeto JSON encerrado por una sola llave de apertura {{ y una de cierre }}**.
- No debes incluir texto fuera del bloque JSON (ni antes ni después).
- No incluyas ```json ni ningún otro tipo de formato de código.
- No debes repetir claves ni dejar llaves sin cerrar.
- Asegúrate de que cada campo esté bien escrito y que todas las comillas, llaves y comas estén correctamente balanceadas.
- No incluyas comillas dobles adicionales ni espacios innecesarios, ni uses comillas simples para los valores de los campos.
- Si un campo no existe en el texto, déjalo vacío o 0.
- Respeta los nombres de las claves exactamente como aparecen en la lista.

Convierte el siguiente texto de un fondo en el siguiente esquema (respeta los nombres de las claves exactamente):
{CAMPOS_OBJETIVO}

    Estos son los significados de cada campo:

    - Titulo: nombre del fondo, debe ser un texto corto y descriptivo. (es el primer campo del texto que estás procesando) *MÁXIMO 200 CARACTERES*
    - Financiador: entidad que proporciona los recursos para el fondo. Debes usar ANID, CORFO, FondosGob. Solo esas opciones.
    - Alcance: Una de las siguientes opciones: 
        "AP": "Arica y Parinacota",
		"TA": "Tarapacá",
		"AN": "Antofagasta",
		"AT": "Atacama",
		"CO": "Coquimbo",
		"VA": "Valparaíso",
		"RM": "Santiago",
		"LI": "O'Higgins",
		"ML": "Maule",
		"NB": "Ñuble",
		"BI": "Biobío",
		"AR": "La Araucanía",
		"LR": "Los Ríos",
		"LL": "Los Lagos",
		"AI": "Aysén",
		"MA": "Magallanes"
    Debes poner solo "AP" o "MA", etc, analiza los textos antes de decidir, cuando el alcance entregado sea Nacional pon "RM", cuando sea Regional lee el texto y busca alguna de las regiones correspondiente y pon sus siglas
    - Descripcion: Breve resumen del fondo, intenta darle énfasis a la parte de los objetivos e intenta llegar al máximo de caracteres, necesitamos bastante texto en este campo *MÁXIMO 1000 CARACTERES*
    - FechaDeApertura: (fFecha de apertura del fondo, formato YYYY-MM-DD) 
    - FechaDeCierre: (Fecha de cierre del fondo, formato YYYY-MM-DD)
    - DuracionEnMeses: (duración aproximada en meses, debe ser un número entero, si no aplica, escribir 0)
    - Beneficios: (¿qué otorga el fondo?, Ej: "Capacitación", "Asesoría técnica", "Inversión en infraestructura", etc.) *MÁXIMO 1000 CARACTERES*
    - Requisitos: (Descripción cualitativa de los requisitos, requisitos importantes para postular, EJ: "Tener RUT chileno", "Ser persona natural o jurídica", "Estar insrito en un programa x", etc.) *MÁXIMO 1000 CARACTERES*
    - MontoMinimo: (en pesos chilenos, si no aplica, escribir 0, debe ser un número entero y se refiere al monto mínimo que este fondo otorga)
    - MontoMaximo: (en pesos chilenos, si no aplica, escribir 0, debe ser un número entero y se refiere al monto máximo que este fondo otorga)
    - Estado: una de las siguientes opciones:
        "PRX": "Próximo",
		"ABI": "Abierto",
		"EVA": "En evaluación",
		"ADJ": "Adjudicado",
		"SUS": "Suspendido",
		"PAY": "Patrocinio Institucional",
		"DES": "Desierto",
		"CER": "Cerrrado"
    Debes poner solo "PRX" o "ABI", etc.

    - TipoDeBeneficio: una de las siguientes opciones:
        "CAP": "Capacitacion",
		"RIE": "Capital de riesgo",
		"CRE": "Creditos",
		"GAR": "Garantias",
		"MUJ": "Incentivo mujeres",
		"OTR": "Otros incentivos",
		"SUB": "Subsidios"
    Debes poner solo "CAP" o "SUB", etc.

    - TipoDePerfil: una de las siguientes opciones:
        "EMP": "Empresa",
		"EXT": "Extranjero",
		"INS": "Institucion",
		"MED": "Intermediario",
		"ORG": "Organizacion",
		"PER": "Persona"
    Debes poner solo "EMP" o "PER", etc.

    - EnlaceDelDetalle: (URL o enlace al detalle del fondo)
    - EnlaceDeLaFoto: (URL o enlace a la foto del fondo), si no hay dejar en blanco

Texto del fondo:
{texto}
    """

    try:
        resp = requests.post(API, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.3, "top_p": 0.9}
        }, timeout=180)
        resp.raise_for_status()
        raw_text = resp.json().get("response", "")
    except Exception as e:
        print(f"Error llamando al modelo: {e}")
        return {}

    json_text = extraer_json_puro(raw_text)
    if not json_text:
        print("No se obtuvo JSON válido del modelo. Respuesta cruda:")
        print(raw_text[:1000])
        return {}

    try:
        parsed = json.loads(json_text)
        return parsed
    except json.JSONDecodeError as e:
        print("JSON malformado devuelto por el modelo:")
        print(json_text[:1000])
        print("Error:", e)
        return {}


def procesar_dataset(nombre, cfg):
    input_path = cfg["input"]
    output_path = cfg["output"]

    if not os.path.exists(input_path):
        print(f"[{nombre}] Archivo de entrada no encontrado: {input_path} — se salta.")
        return

    try:
        df = pd.read_csv(input_path)
    except Exception as e:
        print(f"[{nombre}] Error al leer CSV {input_path}: {e}")
        return

    resultados = []
    for idx, row in df.iterrows():
        print(f"[{nombre}] Procesando {idx+1}/{len(df)}...")
        texto = cfg["template"](row)
        data = estructurar_fondo(texto)

        # Recalcular estado usando fechas
        estado = calcular_estado(data.get("FechaDeApertura"), data.get("FechaDeCierre"))
        data["Estado"] = estado

        # asegurar que todos los campos objetivo estén presentes
        resultados.append({campo: data.get(campo, "") for campo in CAMPOS_OBJETIVO})

    # Guardar CSV limpio
    out_df = pd.DataFrame(resultados, columns=CAMPOS_OBJETIVO)
    try:
        out_df.to_csv(output_path, index=False, encoding="utf-8")
        print(f"✅ {nombre} limpio guardado en {output_path} (total {len(out_df)})")
    except Exception as e:
        print(f"Error al guardar {output_path}: {e}")


if __name__ == "__main__":
    for nombre, cfg in DATASETS.items():
        procesar_dataset(nombre, cfg)
