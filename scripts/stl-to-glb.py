# Converte un STL in GLB per <model-viewer> con un materiale PBR semplice.
# Uso (Blender headless):
#   blender --background --python scripts/stl-to-glb.py -- <input.stl> <output.glb> [r g b roughness]
# Default: marmo verde (per "on the corner").
import bpy
import sys

argv = sys.argv[sys.argv.index('--') + 1:]
stl_in, glb_out = argv[0], argv[1]
color = (float(argv[2]), float(argv[3]), float(argv[4])) if len(argv) >= 5 else (0.055, 0.18, 0.12)
roughness = float(argv[5]) if len(argv) >= 6 else 0.25

# Scena pulita
bpy.ops.wm.read_factory_settings(use_empty=True)

bpy.ops.wm.stl_import(filepath=stl_in)
obj = bpy.context.selected_objects[0]

# Centra sull'origine e appoggia al piano (comodo per il turntable del viewer)
bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME')
obj.location = (0, 0, 0)

# Shading smooth con angolo, per non arrotondare gli spigoli vivi della lampada
bpy.ops.object.shade_smooth_by_angle(angle=0.6109)  # ~35 gradi

# Materiale "green marble" (approssimazione PBR del render di riferimento)
mat = bpy.data.materials.new(name='Material')
mat.use_nodes = True
bsdf = mat.node_tree.nodes['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (*color, 1.0)
bsdf.inputs['Roughness'].default_value = roughness
obj.data.materials.clear()
obj.data.materials.append(mat)

bpy.ops.export_scene.gltf(
    filepath=glb_out,
    export_format='GLB',
    export_apply=True,
    export_yup=True,
)
print('GLB esportato:', glb_out)
