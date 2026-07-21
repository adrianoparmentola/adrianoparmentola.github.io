"""Eseguito headless da Blender per esportare la lampada "on the corner" in
glTF binario (.glb), da usare con <model-viewer> nel sito.

Uso:
"C:\\Program Files\\Blender Foundation\\Blender 4.4\\blender.exe" --background \
  "<path>\\on the corner render file .blend" --python scripts/blender_export_glb.py -- <output.glb>
"""

import sys
import bpy

argv = sys.argv
argv = argv[argv.index("--") + 1:] if "--" in argv else []
output_path = argv[0] if argv else "lamp.glb"

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
)

print(f"GLB esportato in: {output_path}")
