from urllib.parse import urljoin
from bs4 import BeautifulSoup
from datetime import datetime
import pandas as pd
import requests
import re
import os

BASE_URL = "https://www.fondos.gob.cl"
HEADERS = {"User-Agent": "Mozilla/5.0"}

# Mapeo de meses en español abreviado a número
MESES = {
    "ene.": "01", "feb.": "02", "mar.": "03", "abr.": "04", "may.": "05", "jun.": "06",
    "jul.": "07", "ago.": "08", "sept.": "09", "set.": "09", "oct.": "10", "nov.": "11", "dic.": "12"
}

# Ruta base donde se guardarán los CSVs (carpeta csvs dentro de sucios)
CSV_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "csvs")
os.makedirs(CSV_DIR, exist_ok=True)  # Crear la carpeta si no existe


def fetch_html(url, head):
    res = requests.get(url, headers=head)
    res.raise_for_status()
    return res.text


def parse_main_page(html, url):
    soup = BeautifulSoup(html, "html.parser")
    fondos = []

    cards = soup.select("div.grilla div.card")
    for card in cards:
        try:
            enlace = card.find_parent("a")["href"]
            url_detalle = urljoin(url, enlace)

            entidad = card.select_one("small.text-uppercase").get_text(strip=True)
            nombre = card.select_one("h6").get_text(strip=True)
            alcance = card.select_one("span.text-white").get_text(strip=True)

            p_tags = card.find_all("p")
            beneficiarios = p_tags[0].get_text(strip=True) if len(p_tags) >= 1 else ""
            fechas_texto = p_tags[1].get_text() if len(p_tags) >= 2 else ""
            monto = p_tags[2].get_text(strip=True) if len(p_tags) >= 3 else ""

            inicio, fin = "", ""
            if "Inicio:" in fechas_texto and "|" in fechas_texto:
                partes = fechas_texto.replace("Inicio:", "").split("|")
                if len(partes) == 2:
                    inicio = partes[0].strip()
                    fin = partes[1].replace("Fin:", "").strip()

            fondos.append({
                "nombre": nombre,
                "entidad": entidad,
                "alcance": alcance,
                "beneficiarios": beneficiarios,
                "fecha_inicio": inicio,
                "fecha_fin": fin,
                "monto": monto,
                "url_detalle": url_detalle
            })
        except Exception as e:
            print(f"[ERROR tarjeta]: {e}")
            continue

    return fondos


def parse_fecha_espanol(fecha_str):
    """Convierte '21 abr. 25' en datetime(2025, 4, 21)"""
    try:
        partes = fecha_str.lower().split()
        if len(partes) != 3:
            return None
        dia = partes[0]
        mes = MESES.get(partes[1])
        anio = "20" + partes[2]
        if mes is None:
            return None
        fecha_formateada = f"{anio}-{mes}-{dia.zfill(2)}"
        return datetime.strptime(fecha_formateada, "%Y-%m-%d")
    except:
        return None


def parse_detail_page(html, fondo):
    soup = BeautifulSoup(html, "html.parser")

    descripcion_general = ""
    div = soup.find("div", class_="mb-4 d-block")
    if div:
        p = div.find("p")
        if p:
            descripcion_general = re.sub(r'\s+', ' ', p.get_text(strip=True)).strip()

    categoria_tag = soup.find("small", string="Categoría:")
    categoria = categoria_tag.find_next_sibling("span").get_text(strip=True) if categoria_tag else ""

    fechas_dict = {
        "postulacion_inicio": None,
        "postulacion_cierre": None,
        "resultados": None,
        "firma_convenios": None
    }

    bloques = soup.select("div#lineatiempo div.row div.col-lg-3")
    for bloque in bloques:
        fecha_tag = bloque.find("span")
        etapa_tag = bloque.find("p")
        if not fecha_tag or not etapa_tag:
            continue

        raw_fecha = fecha_tag.get_text(strip=True)
        etapa_desc = etapa_tag.get_text(strip=True).lower()
        fecha = parse_fecha_espanol(raw_fecha)
        if not fecha:
            continue

        if "inicio" in etapa_desc and "postul" in etapa_desc:
            fechas_dict["postulacion_inicio"] = fecha
        elif "cierre" in etapa_desc and "postul" in etapa_desc:
            fechas_dict["postulacion_cierre"] = fecha
        elif "resultado" in etapa_desc:
            fechas_dict["resultados"] = fecha
        elif "firma" in etapa_desc and "convenio" in etapa_desc:
            fechas_dict["firma_convenios"] = fecha

    fondo.update({
        "descripcion": descripcion_general,
        "categoria": categoria,
        **fechas_dict
    })
    return fondo


def buscar_en_fondosgob():
    print("Buscando fondos en el Ministerio Secretaría General de Gobierno...")
    main_html = fetch_html(BASE_URL, HEADERS)
    fondos = parse_main_page(main_html, BASE_URL)
    fondos_completos = []
    print(f"{len(fondos)} fondos encontrados. Procesando detalle...\n")

    for i, fondo in enumerate(fondos, start=1):
        try:
            detalle_html = fetch_html(fondo["url_detalle"], HEADERS)
            fondo_completo = parse_detail_page(detalle_html, fondo)
            fondos_completos.append(fondo_completo)
        except Exception as e:
            print(f"[ERROR detalle]: {fondo['nombre']} - {e}")

    df = pd.DataFrame(fondos_completos)

    # Normalizar fechas
    fecha_cols = [
        "postulacion_inicio", "postulacion_cierre",
        "resultados", "firma_convenios"
    ]
    for col in fecha_cols:
        df[col] = pd.to_datetime(df[col], errors="coerce", format="%Y-%m-%d")

    output_path = os.path.join(CSV_DIR, "abiertos-fondosgob.csv")
    df.to_csv(output_path, index=False, encoding="utf-8")
    print(f"\nScraping completado. Total fondos guardados: {len(df)}")
    print(f"Archivo guardado en: {output_path}\n")
