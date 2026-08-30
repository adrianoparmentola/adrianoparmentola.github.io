# Foto personali

Metti qui le foto per il blocco personale della home (formato `.webp`,
`.jpg` o `.png`). Vengono raccolte automaticamente in ordine alfabetico,
quindi conviene numerarle: `01-....webp`, `02-....webp`, …

Le prime **4** finiscono nella griglia della home: la prima è quella
grande (verticale), le altre tre più piccole.

Per ottimizzarle dalle originali:

```bash
npm run optimize-personal
```

(legge da `wbsite assets/foto personali/` e scrive qui in `.webp`)

Finché questa cartella è vuota, il blocco personale mostra solo il testo,
senza rompere la build.
