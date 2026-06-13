# AudioNotes

Aplicacion web local para grabar voz, detectar la nota musical mas cercana en vivo y convertir la melodia cantada en una linea MIDI reproducible.

## Uso

Ejecuta un servidor local desde esta carpeta y abre la URL en un navegador moderno:

```powershell
python -m http.server 5174 --bind 127.0.0.1
```

Despues abre `http://127.0.0.1:5174` y concede permiso de microfono. Funciona mejor en Chrome o Edge porque soportan `MediaRecorder`, Web Audio API y exportacion WebM.

## Funciones incluidas

- Grabacion de audio con pausa, reanudacion, detencion y reproduccion.
- Deteccion de nota en vivo en formato europeo: Do, Re, Mi, Fa, Sol, La, Si.
- Afinador con desviacion en cents, frecuencia y nivel de entrada.
- Visualizacion de onda de sonido.
- Mapa musical de notas detectadas en la grabacion.
- Modo piano MIDI con seleccion de instrumento, reproduccion de notas detectadas y capa opcional de voz original.
- Reproduccion de solo MIDI, sin la voz original.
- Importacion de archivos de audio locales para analizarlos y generar notas/MIDI sin grabar desde microfono.
- Editor MIDI para anadir notas manuales y quitar la nota seleccionada o la ultima nota.
- Eliminacion de tomas/canciones desde la pestaña de exportacion.
- Exportacion a WAV, WebM u OGG/MP4 segun navegador, MIDI, JSON y CSV.
- Macros de teclado: Espacio para grabar/pausar/reanudar, R para grabar/detener, P para reproducir voz y M para modo MIDI.

## Notas tecnicas

La deteccion de tono usa autocorrelacion sobre la entrada de microfono. En voces con mucho ruido, consonantes o vibrato fuerte, la app agrupa solo los tramos estables que superan el umbral de sensibilidad y la duracion minima configurada.
