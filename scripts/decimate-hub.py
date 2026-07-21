# Decima l'STL gigante del hub Hum.us (~52M triangoli, 2.5GB) in un GLB
# esplorabile nel browser. Import STL -> Decimate modifier a rapporto molto
# aggressivo -> smooth by angle -> materiale neutro -> GLB con Draco.
# Uso: blender --background --python scripts/decimate-hub.py -- <in.stl> <out.glb> <ratio>
import bpy
import sys

argv = sys.argv[sys.argv.index('--') + 1:]
stl_in, glb_out = argv[0], argv[1]
ratio = float(argv[2]) if len(argv) > 2 else 0.006  # 52M * 0.006 ~ 310K tris

bpy.ops.wm.read_factory_settings(use_empty=True)
print('importo STL (file molto grande, può richiedere minuti)...', flush=True)
bpy.ops.wm.stl_import(filepath=stl_in)
obj = bpy.context.selected_objects[0]
print('triangoli importati:', len(obj.data.polygons), flush=True)

bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_VOLUME')
obj.location = (0, 0, 0)

mod = obj.modifiers.new(name='dec', type='DECIMATE')
mod.ratio = ratio
bpy.context.view_layer.objects.active = obj
print('applico decimate ratio', ratio, '...', flush=True)
bpy.ops.object.modifier_apply(modifier='dec')
print('triangoli dopo decimate:', len(obj.data.polygons), flush=True)

bpy.ops.object.shade_smooth_by_angle(angle=0.6109)

mat = bpy.data.materials.new(name='HubNeutral')
mat.use_nodes = True
bsdf = mat.node_tree.nodes['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (0.82, 0.78, 0.72, 1.0)
bsdf.inputs['Roughness'].default_value = 0.6
obj.data.materials.clear()
obj.data.materials.append(mat)

bpy.ops.export_scene.gltf(
    filepath=glb_out,
    export_format='GLB',
    export_apply=True,
    export_yup=True,
    export_draco_mesh_compression_enable=True,
)
print('GLB esportato:', glb_out, flush=True)
