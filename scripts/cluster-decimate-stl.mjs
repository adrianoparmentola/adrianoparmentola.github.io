// Decimatore streaming per STL binari giganti (il hub Hum.us è 2.5GB, ~52M
// triangoli: Blender va in out-of-memory). Vertex clustering su griglia 3D:
// si legge lo stream a memoria costante, si quantizzano i vertici a celle,
// si tengono solo i triangoli non degeneri tra celle distinte, si esporta
// un GLB minimale (posizioni + normali smooth + indici, un materiale).
//
// Uso: node scripts/cluster-decimate-stl.mjs <in.stl> <out.glb> [gridSize]
//   gridSize piu' alto = piu' dettaglio = piu' triangoli. Default 400.

import fs from 'node:fs';
import path from 'node:path';

const [stlIn, glbOut, gridArg] = process.argv.slice(2);
const GRID = Number(gridArg ?? 400);

// --- passata 1: bounding box (streaming) ---
async function pass(fn) {
  const stream = fs.createReadStream(stlIn, { highWaterMark: 8 * 1024 * 1024 });
  let leftover = Buffer.alloc(0);
  let headerSkipped = false;
  let triCount = 0;
  for await (const chunk of stream) {
    let buf = leftover.length ? Buffer.concat([leftover, chunk]) : chunk;
    let off = 0;
    if (!headerSkipped) {
      if (buf.length < 84) { leftover = buf; continue; }
      triCount = buf.readUInt32LE(80);
      off = 84;
      headerSkipped = true;
    }
    const usable = off + Math.floor((buf.length - off) / 50) * 50;
    for (; off < usable; off += 50) fn(buf, off);
    leftover = Buffer.from(buf.subarray(usable));
  }
  return triCount;
}

console.log('passata 1/2: bounding box...');
let minX = Infinity, minY = Infinity, minZ = Infinity;
let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
const declared = await pass((b, o) => {
  // 12 byte di normale, poi 3 vertici xyz float32
  for (let v = 0; v < 3; v++) {
    const x = b.readFloatLE(o + 12 + v * 12);
    const y = b.readFloatLE(o + 16 + v * 12);
    const z = b.readFloatLE(o + 20 + v * 12);
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }
});
console.log('triangoli dichiarati:', declared, '| bbox:',
  [minX, minY, minZ].map(n => n.toFixed(1)), '->', [maxX, maxY, maxZ].map(n => n.toFixed(1)));

const sx = (maxX - minX) || 1, sy = (maxY - minY) || 1, sz = (maxZ - minZ) || 1;
const maxSpan = Math.max(sx, sy, sz);
// celle cubiche uniformi sulla dimensione maggiore
const cell = maxSpan / GRID;

// --- passata 2: clustering ---
console.log('passata 2/2: clustering su griglia', GRID, '...');
const cellIndex = new Map(); // chiave cella -> indice vertice
const positions = []; // xyz accumulati (media incrementale per cella)
const counts = [];
const normals = []; // somma normali faccia per vertice
const triSet = new Set();
const indices = [];

const gx = Math.ceil(sx / cell) + 1, gy = Math.ceil(sy / cell) + 1;

function clusterOf(x, y, z) {
  const cx = Math.min(Math.floor((x - minX) / cell), gx - 1);
  const cy = Math.min(Math.floor((y - minY) / cell), gy - 1);
  const cz = Math.floor((z - minZ) / cell);
  const key = cx + cy * 4096 + cz * 4096 * 4096; // gx,gy <= GRID+1 < 4096
  let idx = cellIndex.get(key);
  if (idx === undefined) {
    idx = positions.length / 3;
    cellIndex.set(key, idx);
    positions.push(x, y, z);
    counts.push(1);
    normals.push(0, 0, 0);
  } else {
    // media incrementale della posizione dentro la cella
    const n = ++counts[idx];
    positions[idx * 3] += (x - positions[idx * 3]) / n;
    positions[idx * 3 + 1] += (y - positions[idx * 3 + 1]) / n;
    positions[idx * 3 + 2] += (z - positions[idx * 3 + 2]) / n;
  }
  return idx;
}

await pass((b, o) => {
  const ax = b.readFloatLE(o + 12), ay = b.readFloatLE(o + 16), az = b.readFloatLE(o + 20);
  const bx = b.readFloatLE(o + 24), by = b.readFloatLE(o + 28), bz = b.readFloatLE(o + 32);
  const cx = b.readFloatLE(o + 36), cy = b.readFloatLE(o + 40), cz = b.readFloatLE(o + 44);
  const i0 = clusterOf(ax, ay, az), i1 = clusterOf(bx, by, bz), i2 = clusterOf(cx, cy, cz);
  if (i0 === i1 || i1 === i2 || i0 === i2) return; // degenerato dopo clustering
  // dedup triangoli identici (qualunque rotazione degli indici)
  const key = [i0, i1, i2].sort((a, b2) => a - b2).join(',');
  if (triSet.has(key)) return;
  triSet.add(key);
  indices.push(i0, i1, i2);
  // normale di faccia accumulata sui 3 vertici (smooth shading)
  const ux = bx - ax, uy = by - ay, uz = bz - az;
  const vx = cx - ax, vy = cy - ay, vz = cz - az;
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  for (const i of [i0, i1, i2]) {
    normals[i * 3] += nx; normals[i * 3 + 1] += ny; normals[i * 3 + 2] += nz;
  }
});

// --- filtro componenti connesse: elimina frammenti isolati (es. i pannelli
// fondale della scena di rendering, staccati dal corpo principale) ---
const MIN_COMPONENT = Number(process.argv[5] ?? 60); // triangoli minimi per componente
{
  const nVerts = positions.length / 3;
  const parent = new Int32Array(nVerts).map((_, i) => i);
  const find = (a) => { while (parent[a] !== a) { parent[a] = parent[parent[a]]; a = parent[a]; } return a; };
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb; };
  for (let t = 0; t < indices.length; t += 3) {
    union(indices[t], indices[t + 1]);
    union(indices[t + 1], indices[t + 2]);
  }
  const compTris = new Map();
  for (let t = 0; t < indices.length; t += 3) {
    const r = find(indices[t]);
    compTris.set(r, (compTris.get(r) ?? 0) + 1);
  }
  const sizes = [...compTris.values()].sort((a, b) => b - a);
  console.log('componenti:', compTris.size, '| top 12 per triangoli:', sizes.slice(0, 12).join(', '));
  const kept = [];
  for (let t = 0; t < indices.length; t += 3) {
    if ((compTris.get(find(indices[t])) ?? 0) >= MIN_COMPONENT) {
      kept.push(indices[t], indices[t + 1], indices[t + 2]);
    }
  }
  const removed = (indices.length - kept.length) / 3;
  indices.length = 0;
  indices.push(...kept);
  console.log('triangoli rimossi come frammenti:', removed);
}

const vertCount = positions.length / 3;
console.log('vertici:', vertCount, '| triangoli:', indices.length / 3);

// normalizza le normali
for (let i = 0; i < vertCount; i++) {
  const x = normals[i * 3], y = normals[i * 3 + 1], z = normals[i * 3 + 2];
  const l = Math.hypot(x, y, z) || 1;
  normals[i * 3] = x / l; normals[i * 3 + 1] = y / l; normals[i * 3 + 2] = z / l;
}

// centra sull'origine (comodo per il viewer)
const cxm = (minX + maxX) / 2, cym = (minY + maxY) / 2, czm = (minZ + maxZ) / 2;
for (let i = 0; i < vertCount; i++) {
  positions[i * 3] -= cxm; positions[i * 3 + 1] -= cym; positions[i * 3 + 2] -= czm;
}

// --- scrittura GLB (Z-up STL -> Y-up glTF: ruotiamo via nodo) ---
const posArr = new Float32Array(positions);
const nrmArr = new Float32Array(normals);
const idxArr = new Uint32Array(indices);

const posMin = [Infinity, Infinity, Infinity], posMax = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < vertCount; i++) {
  for (let k = 0; k < 3; k++) {
    const v = posArr[i * 3 + k];
    if (v < posMin[k]) posMin[k] = v;
    if (v > posMax[k]) posMax[k] = v;
  }
}

function align4(n) { return Math.ceil(n / 4) * 4; }
const posBytes = posArr.byteLength, nrmBytes = nrmArr.byteLength, idxBytes = idxArr.byteLength;
const binLen = align4(posBytes) + align4(nrmBytes) + align4(idxBytes);
const bin = Buffer.alloc(binLen);
Buffer.from(posArr.buffer).copy(bin, 0);
Buffer.from(nrmArr.buffer).copy(bin, align4(posBytes));
Buffer.from(idxArr.buffer).copy(bin, align4(posBytes) + align4(nrmBytes));

const json = {
  asset: { version: '2.0', generator: 'cluster-decimate-stl' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  // rotazione -90 gradi su X: Z-up (STL) -> Y-up (glTF)
  nodes: [{ mesh: 0, rotation: [-Math.SQRT1_2, 0, 0, Math.SQRT1_2] }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0, NORMAL: 1 }, indices: 2, material: 0 }] }],
  materials: [
    {
      name: 'HubNeutral',
      pbrMetallicRoughness: { baseColorFactor: [0.82, 0.78, 0.72, 1], metallicFactor: 0, roughnessFactor: 0.6 },
      doubleSided: true,
    },
  ],
  accessors: [
    { bufferView: 0, componentType: 5126, count: vertCount, type: 'VEC3', min: posMin, max: posMax },
    { bufferView: 1, componentType: 5126, count: vertCount, type: 'VEC3' },
    { bufferView: 2, componentType: 5125, count: idxArr.length, type: 'SCALAR' },
  ],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: posBytes, target: 34962 },
    { buffer: 0, byteOffset: align4(posBytes), byteLength: nrmBytes, target: 34962 },
    { buffer: 0, byteOffset: align4(posBytes) + align4(nrmBytes), byteLength: idxBytes, target: 34963 },
  ],
  buffers: [{ byteLength: binLen }],
};

let jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
const jsonPad = align4(jsonBuf.length) - jsonBuf.length;
if (jsonPad) jsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]);

const total = 12 + 8 + jsonBuf.length + 8 + binLen;
const out = Buffer.alloc(total);
let o = 0;
out.write('glTF', o); o += 4;
out.writeUInt32LE(2, o); o += 4;
out.writeUInt32LE(total, o); o += 4;
out.writeUInt32LE(jsonBuf.length, o); o += 4;
out.write('JSON', o); o += 4;
jsonBuf.copy(out, o); o += jsonBuf.length;
out.writeUInt32LE(binLen, o); o += 4;
out.write('BIN\0', o, 'binary'); o += 4;
bin.copy(out, o);

fs.mkdirSync(path.dirname(glbOut), { recursive: true });
fs.writeFileSync(glbOut, out);
console.log('GLB scritto:', glbOut, `(${(total / 1024 / 1024).toFixed(1)}MB)`);
