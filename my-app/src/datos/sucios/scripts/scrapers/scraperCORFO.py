# fondoscorfo.py
import os
import time
import re
from urllib.parse import urljoin
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import pandas as pd

BASE_URL = "https://corfo.cl/sites/cpp/programasyconvocatorias/"
HEADERS = {"User-Agent": "Mozilla/5.0"}
NUM_PAGINAS_MAX = 10  # tope de seguridad por si algo falla

CSV_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "csvs")
os.makedirs(CSV_DIR, exist_ok=True)


def _parse_fecha_span(span_text):
    """Extrae la fecha en formato dd/mm/YYYY desde un span que puede contener '20/08/2025\n15:00 hrs'."""
    if not span_text:
        return ""
    # Tomamos la primera línea y buscamos patrón dd/mm/yyyy o dd/mm/yy
    first_line = span_text.splitlines()[0].strip()
    m = re.search(r"(\d{1,2}/\d{1,2}/\d{2,4})", first_line)
    return m.group(1) if m else first_line


def _extract_from_detail(html, url):
    """Recibe HTML de detalle y devuelve dict con campos."""
    soup = BeautifulSoup(html, "html.parser")
    # Nombre / título
    titulo_tag = soup.select_one("#section-cabecera-0 h1")
    nombre = titulo_tag.get_text(strip=True) if titulo_tag else None

    # Apertura / Cierre: buscamos los bloques que contienen 'Apertura:' y 'Cierre:'
    apertura = ""
    cierre = ""
    try:
        cabecera = soup.select_one("#section-cabecera-0")
        if cabecera:
            # Buscar spans cercanos a textos "Apertura:" y "Cierre:"
            # buscaremos todos los textos que contengan 'Apertura' o 'Cierre'
            textos = cabecera.get_text(separator="\n", strip=False)
            # fallback: buscar bloques con clase 'divTex_tex_fase2' y extraer spans
            bloques = cabecera.select(".divTex_tex_fase2")
            for b in bloques:
                txt = b.get_text(separator="\n", strip=True).lower()
                span = b.select_one("span")
                span_text = span.get_text("\n", strip=True) if span else ""
                if "apertura" in txt:
                    apertura = _parse_fecha_span(span_text)
                elif "cierre" in txt:
                    cierre = _parse_fecha_span(span_text)
    except Exception:
        pass

    # Alcance / territorios
    alcance = ""
    alc_tag = soup.select_one("#section-cabecera-0 .divTex_fase2")
    if alc_tag:
        alcance = alc_tag.get_text(separator="\n", strip=True)

    # Descripción (buscamos secciones con '¿Qué es?' / marcoque_fase2 o text inside container)
    descripcion = ""
    posible = soup.select_one("#section-cabecera-0 .marcoque_fase2")
    if not posible:
        posible = soup.select_one("#section-cabecera-0 .conteIzq_ficha_fase2")
    if posible:
        p = posible.find("p")
        if p:
            descripcion = p.get_text(separator="\n", strip=True)

    # Beneficio (parte de section-columnas-2)
    beneficio = ""
    col2 = soup.select_one("#section-columnas-2")
    if col2:
        # buscar primer bloque de texto dentro de postula_fase2-cuerpodos_fase2
        b = col2.select_one(".postula_fase2-cuerpodos_fase2")
        if b:
            beneficio = b.get_text(separator="\n", strip=True)

    return {
        "nombre": nombre,
        "apertura": apertura,
        "cierre": cierre,
        "alcance": alcance,
        "descripcion": descripcion,
        "beneficio": beneficio,
        "url": url
    }


def buscar_en_corfo(num_paginas=None, headless=True):
    """
    Scrapea convocatorias desde la página de CORFO.
    num_paginas: límite opcional de páginas a recorrer (por si quieres limitar).
    """
    options = Options()
    if headless:
        options.add_argument("--headless")
    # opcional: evita que geckodriver imprima logs si molesta
    options.log.level = "fatal"

    driver = webdriver.Firefox(options=options)
    wait = WebDriverWait(driver, 15)
    try:
        driver.get(BASE_URL)
        # esperar que el contenedor de resultados exista
        wait.until(EC.presence_of_element_located((By.ID, "convocatorias-results")))
        print("Página principal cargada.")

        resultados = []
        pagina_actual = 1
        max_pages = num_paginas if num_paginas is not None else NUM_PAGINAS_MAX

        while True:
            print(f"Procesando página {pagina_actual}...")
            # asegurarnos de que los elementos estén renderizados
            time.sleep(2)
            soup = BeautifulSoup(driver.page_source, "html.parser")
            cont = soup.select_one("#convocatorias-results")
            cajas = cont.select(".caja-resultados_uno") if cont else []

            # recorrer cajas y extraer enlace de detalle
            links = []
            for caja in cajas:
                a_tag = caja.select_one(".foot-caja_result a[href]")
                if a_tag:
                    href = a_tag["href"].strip()
                    # asegurar URL completa
                    url_detalle = urljoin(BASE_URL, href)
                    links.append(url_detalle)

            print(f"Encontrados {len(links)} enlaces en la página {pagina_actual}.")

            # visitar cada enlace en nueva pestaña para obtener detalle
            for i, detalle_url in enumerate(links, start=1):
                try:
                    # abrir nueva pestaña
                    driver.execute_script("window.open(arguments[0], '_blank');", detalle_url)
                    driver.switch_to.window(driver.window_handles[-1])
                    # esperar que sección de cabecera exista
                    try:
                        wait.until(EC.presence_of_element_located((By.ID, "section-cabecera-0")))
                    except Exception:
                        # si no aparece, esperar un poco más y continuar
                        time.sleep(2)

                    detalle_html = driver.page_source
                    item = _extract_from_detail(detalle_html, detalle_url)
                    resultados.append(item)
                except Exception as e:
                    print(f"[✗] Error al procesar detalle {detalle_url}: {e}")
                finally:
                    # cerrar pestaña de detalle y volver a la principal
                    if len(driver.window_handles) > 1:
                        driver.close()
                        driver.switch_to.window(driver.window_handles[0])
                    time.sleep(0.5)

            # intentar avanzar a siguiente página (buscar link con data-page = current+1)
            # primero leer número de página activa desde el DOM
            try:
                soup = BeautifulSoup(driver.page_source, "html.parser")
                active = soup.select_one("ul.pagination li.page-item.active span.page-link")
                current_num = int(active.get_text(strip=True)) if active else pagina_actual
            except Exception:
                current_num = pagina_actual

            next_page_num = current_num + 1
            # buscar el enlace con data-page = next_page_num
            try:
                next_link_el = driver.find_element(By.CSS_SELECTOR, f"ul.pagination a.page-link[data-page='{next_page_num}']")
                # hacer click (es javascript:void(0) pero tiene handler)
                driver.execute_script("arguments[0].click();", next_link_el)
                # esperar que el contenido cambie (podemos esperar que el active cambie)
                time.sleep(3)
                pagina_actual = next_page_num
            except Exception:
                # no hay siguiente página, rompemos
                print("No se encontró página siguiente. Fin de paginación.")
                break

            if pagina_actual >= max_pages:
                print("Se alcanzó el límite de páginas configurado.")
                break

        # convertir a dataframe y guardar
        df = pd.DataFrame(resultados)
        output_path = os.path.join(CSV_DIR, "abiertos-corfo.csv")
        df.to_csv(output_path, index=False, encoding="utf-8")
        print(f"\nScraping completado. Total fondos guardados: {len(df)}")
        print(f"Archivo guardado en: {output_path}\n")

    finally:
        driver.quit()
