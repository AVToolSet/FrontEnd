from __future__ import annotations

import os
from io import BytesIO

from flask import Flask, render_template, request, send_file

from docreg_core import AreaRequirement, workbook_bytes

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "frontend-tools-secret")

DOCUMENT_CODES = [(0, "Drawing Schedule"), (1, "Issue Log"), (2, "Change Log")]
ME_CODES = [
    (10, "Combined M&E"),
    (11, "Elevation"),
    (12, "Plan"),
    (13, "High Level"),
    (14, "Low Level"),
    (15, "Key Plan"),
    (16, "Room Booking Plan"),
    (17, "Custom Metalwork"),
    (18, "Furniture Design"),
    (19, "Equipment Detail"),
]
LIGHTING_CODES = [
    (20, "Lighting Combined"),
    (21, "Lighting"),
    (22, "Load Schedule"),
    (23, "Lighting Terminals Plan"),
    (24, "Panel Layout"),
]
SCHEMATIC_CODES = [
    (30, "System Schematic"),
    (31, "Video Schematic"),
    (32, "Audio Schematic"),
    (33, "Control Schematic"),
    (34, "Power Schematic"),
    (35, "Rack Layout"),
    (36, "I/O Panel Layout"),
]
DRAWING_GROUPS = [
    ("Documents", DOCUMENT_CODES),
    ("M&E", ME_CODES),
    ("Lighting", LIGHTING_CODES),
    ("Schematics", SCHEMATIC_CODES),
]


@app.get("/")
def home():
    return render_template("home.html")


@app.get("/docreg")
def docreg_index():
    return render_template(
        "docreg/index.html",
        drawing_groups=DRAWING_GROUPS,
        seqf_number="",
        area_entries=[{"name": "", "selected_codes": set(), "index": 0}],
        error_message=None,
    )


@app.post("/docreg/generate")
def docreg_generate():
    seqf = request.form.get("seqf_number", "").strip()
    area_names = request.form.getlist("area_name")
    areas: list[AreaRequirement] = []
    area_entries: list[dict[str, object]] = []

    for index, name in enumerate(area_names):
        clean_name = name.strip()
        prefix = f"area_{index}_"
        area_codes = {
            int(key[len(prefix) :])
            for key in request.form
            if key.startswith(prefix) and request.form.get(key) == "on"
        }
        area_entries.append({"name": clean_name, "selected_codes": area_codes, "index": index})
        if clean_name:
            areas.append(AreaRequirement(name=clean_name, selected_codes=area_codes))

    if not area_entries:
        area_entries = [{"name": "", "selected_codes": set(), "index": 0}]

    if not areas:
        return render_template(
            "docreg/index.html",
            drawing_groups=DRAWING_GROUPS,
            seqf_number=seqf,
            area_entries=area_entries,
            error_message="Add at least one area before generating the workbook.",
        )

    try:
        payload = workbook_bytes(seqf, areas)
    except ValueError as exc:
        return render_template(
            "docreg/index.html",
            drawing_groups=DRAWING_GROUPS,
            seqf_number=seqf,
            area_entries=area_entries,
            error_message=str(exc),
        )

    return send_file(
        BytesIO(payload),
        as_attachment=True,
        download_name="document_register.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )


@app.get("/poe-calc")
def poe_calc():
    return render_template("poe_calc/index.html")


@app.get("/power-calc")
def power_calc():
    return render_template("power_calc/index.html")


@app.get("/calcs")
def calcs():
    return render_template("calcs/index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
