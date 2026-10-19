# Listas: los datos de una pieza de varios temas

Todos los moldes trabajan sobre **un** tema y viven en `datos-prueba/<tema>/`.
`lista-numerada` es el único que recorre **varios**, así que sus datos van acá,
en un archivo por lista.

## Por qué acá y no en `datos-prueba/<tema>/`

Una lista no es un tema: es un orden de temas, con un recorte de audio de cada
uno. Meterla en la carpeta de un tema la ataría a uno de sus ítems, que es
justamente lo que no es. Esta carpeta queda al lado y **no cambia nada** de cómo
se guardan los temas: cada ítem apunta a los archivos que ya están en `assets/`.

El esquema vive en `templates/lista-numerada/lista.ts`, **no en `shared/`**: es el
único molde que lo usa y la estructura común la decide Agustín (regla 7 del
`CLAUDE.md`). Si mañana otro molde necesita listas, se mueve.

## Formato

```json
{
  "titulo": "el rótulo de la pieza (lo escribe una persona)",
  "items": [
    {
      "title": "nombre del tema",
      "artists": "artistas",
      "cover": "ruta dentro de assets/, o vacío",
      "audio": { "src": "ruta dentro de assets/", "start": 0, "end": 7 }
    }
  ]
}
```

El orden del array es **el orden del ranking**: el primero es el número 1. En qué
orden se revelan (del 1 al último o al revés) lo decide el molde, no los datos.

La duración de la pieza es la suma de los `end - start` de cada ítem.
