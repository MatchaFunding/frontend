import os
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import requests
from bs4 import BeautifulSoup
import pandas as pd
import dateparser
import json
import re

# Ruta base donde se guardarán los CSVs (carpeta csvs dentro de sucios)
CSV_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "csvs")
os.makedirs(CSV_DIR, exist_ok=True)

def parse_fecha(texto):
    if not texto or texto.strip() == "":
        return ""
    texto = re.sub(r"\(.*?\)", "", texto).strip()
    texto = re.sub(r"\s*-\s*\d{1,2}:\d{2}", "", texto).strip()
    fecha = dateparser.parse(texto, languages=['es'])
    if fecha is None:
        return ""
    tiene_dia = bool(re.search(r"\b([1-9]|[12][0-9]|3[01])\b", texto))
    if not tiene_dia:
        fecha = fecha.replace(day=1)
    return fecha.strftime("%d-%m-%Y")


def buscar_en_anid():
    print(f"Buscando fondos en ANID...")
    url = "https://anid.cl/wp-admin/admin-ajax.php"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*",
        "Accept-Language": "es-ES,es;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://anid.cl",
        "Referer": "https://anid.cl/concursos/",
        "X-Requested-With": "XMLHttpRequest"
    }
    concursos = []
    page = 1
    while True:
        payload = {
            "action": "jet_smart_filters",
            "provider": "jet-engine/default",
            "query[_meta_query_estado]": "Abierto",
            "defaults[post_status][]": "publish",
            "defaults[post_type]": "concursos",
            "defaults[posts_per_page]": "6",
            "defaults[paged]": str(page),
            "defaults[ignore_sticky_posts]": "1",
            "defaults[orderby]": "meta_value",
            "defaults[meta_key]": "fecha_de_inicio",
            "defaults[meta_query][0][key]": "estado",
            "defaults[meta_query][0][value]": "proximo",
            "defaults[meta_query][0][compare]": "!=",
            "defaults[meta_query][0][type]": "CHAR",
            "settings[lisitng_id]": "9417",
            "settings[columns]": "3",
            "settings[columns_tablet]": "2",
            "settings[columns_mobile]": "1",
            "settings[column_min_width]": "240",
            "settings[column_min_width_tablet]": "",
            "settings[column_min_width_mobile]": "",
            "settings[inline_columns_css]": "false",
            "settings[post_status][]": "publish",
            "settings[use_random_posts_num]": "",
            "settings[posts_num]": "6",
            "settings[max_posts_num]": "9",
            "settings[not_found_message]": "Puedes+revisar+próximos+concursos+en+página+<a+href=\"https://anid.cl/calendario-concursos-2025/\">Calendario+de+Concursos</a>",
            "settings[is_masonry]": "",
            "settings[equal_columns_height]": "yes",
            "settings[use_load_more]": "",
            "settings[load_more_id]": "",
            "settings[load_more_type]": "click",
            "settings[load_more_offset][unit]": "px",
            "settings[load_more_offset][size]": "0",
            "settings[loader_text]": "",
            "settings[loader_spinner]": "",
            "settings[use_custom_post_types]": "",
            "settings[custom_post_types][]": "concursos",
            "settings[hide_widget_if]": "",
            "settings[carousel_enabled]": "",
            "settings[slides_to_scroll]": "1",
            "settings[arrows]": "true",
            "settings[arrow_icon]": "fa+fa-angle-left",
            "settings[dots]": "",
            "settings[autoplay]": "true",
            "settings[pause_on_hover]": "true",
            "settings[autoplay_speed]": "5000",
            "settings[infinite]": "true",
            "settings[center_mode]": "",
            "settings[effect]": "slide",
            "settings[speed]": "500",
            "settings[inject_alternative_items]": "",
            "settings[scroll_slider_enabled]": "",
            "settings[scroll_slider_on][]": [
                "desktop",
                "tablet",
                "mobile"
            ],
            "settings[custom_query]": "",
            "settings[custom_query_id]": "",
            "settings[_element_id]": "",
            "settings[collapse_first_last_gap]": "",
            "settings[list_items_wrapper_tag]": "div",
            "settings[list_item_tag]": "div",
            "settings[empty_items_wrapper_tag]": "div",
            "settings[jet_cct_query]": "",
            "props[found_posts]": "342",
            "props[max_num_pages]": "57",
            "props[page]": str(page),
            "indexing_filters": "[19797,15450]"
        }

        response = requests.post(url, headers=headers, data=payload)
        if response.status_code != 200:
            print(f"Error en la página {page}: {response.status_code}")
            break

        data = json.loads(response.text)
        html_content = data.get("content", "")
        if not html_content.strip():
            break

        soup = BeautifulSoup(html_content, "html.parser")
        items = soup.select(".jet-listing-grid__item")
        if not items:
            break

        for item in items:
            text = item.get_text(separator="\n", strip=True)
            lines = text.split("\n")
            enlace_tag = item.find("a", href=True)
            href = enlace_tag["href"] if enlace_tag else ""
            if len(lines) >= 3:
                concurso = {
                    "Subdirección": lines[0],
                    "Nombre del fondo": lines[1],
                    "Inicio": "",
                    "Cierre": "",
                    "Fallo": "",
                    "url": href
                }
                for l in lines[2:]:
                    if "Inicio:" in l:
                        concurso["Inicio"] = parse_fecha(l.replace("Inicio: ", ""))
                    elif "Cierre:" in l:
                        concurso["Cierre"] = parse_fecha(l.replace("Cierre: ", ""))
                    elif "Fecha estimada de fallo" in l:
                        continue
                    elif concurso["Fallo"] == "" and "Ver más" not in l:
                        concurso["Fallo"] = parse_fecha(l.strip())
                concursos.append(concurso)

        print(f"Página {page} procesada con {len(items)/2} ítems.")
        page += 1

    print("Procesando detalles de los concursos...")
    df = pd.DataFrame(concursos)
    df["Inicio"] = pd.to_datetime(df["Inicio"], format="%d-%m-%Y", errors="coerce")
    df["Cierre"] = pd.to_datetime(df["Cierre"], format="%d-%m-%Y", errors="coerce")
    df["Fallo"] = pd.to_datetime(df["Fallo"], format="%d-%m-%Y", errors="coerce")

    df["presentacion"] = ""
    df["publico_objetivo"] = ""
    df["bitacora"] = ""
    df["documentos"] = ""
    df["url_imagen"] = ""

    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Firefox(options=options)

    for idx, row in df.iterrows():
        url = row["url"]
        try:
            driver.get(url)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "jet-tabs__content"))
            )
            soup = BeautifulSoup(driver.page_source, "html.parser")
            imagen_div = soup.find("div", class_="elementor-element elementor-element-bc0d250 elementor-widget elementor-widget-image")
            img = imagen_div.find("img") if imagen_div else None
            url_imagen = img["src"] if img else None
            presentacion_div = soup.find("div", id="jet-tabs-content-1911", class_="jet-tabs__content")
            publico_div = soup.find("div", id="jet-tabs-content-1912", class_="jet-tabs__content")
            bitacora_div = soup.find("div", id="jet-tabs-content-1913", class_="jet-tabs__content")
            documentos_div = soup.find("div", id="jet-tabs-content-1915", class_="jet-tabs__content")
            presentacion = presentacion_div.get_text(separator="\n", strip=True) if presentacion_div else ""
            publico_objetivo = publico_div.get_text(separator="\n", strip=True) if publico_div else ""
            bitacora = bitacora_div.get_text(separator="\n", strip=True) if bitacora_div else ""
            documentos = documentos_div.get_text(separator="\n", strip=True) if documentos_div else ""
            df.at[idx, "presentacion"] = presentacion
            df.at[idx, "publico_objetivo"] = publico_objetivo
            df.at[idx, "bitacora"] = bitacora
            df.at[idx, "documentos"] = documentos
            df.at[idx, "url_imagen"] = url_imagen
        except Exception as e:
            print(f"[✗] Error al procesar {url}: {e}")

    driver.quit()

    output_path = os.path.join(CSV_DIR, "abiertos-anid.csv")
    df.to_csv(output_path, index=False, encoding="utf-8")
    print(f"\nScraping completado. Total fondos guardados: {len(df)}")
    print(f"Archivo guardado en: {output_path}\n")