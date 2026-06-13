# AudioNotes

Aplicacion web local para grabar voz, detectar la nota musical mas cercana en vivo y convertir la melodia cantada en una linea MIDI reproducible.

## Uso

Ejecuta un servidor local desde esta carpeta y abre la URL en un navegador moderno:

```powershell
python -m http.server 5174 --bind 127.0.0.1
```

Despues abre `http://127.0.0.1:5174` y concede permiso de microfono. Funciona mejor en Chrome o Edge porque soportan `MediaRecorder`, Web Audio API y exportacion WebM.

## Ejecutable Windows

Para generar un `.exe` autocontenido:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-exe.ps1
```

El ejecutable queda en `dist\AudioNotes\AudioNotes.exe`. Al abrirlo, levanta un servidor local, abre la app en el navegador y mantiene la ventana de consola activa mientras usas AudioNotes. Cierra esa ventana para detener la app.

## Funciones incluidas

- Grabacion de audio con pausa, reanudacion, detencion y reproduccion.
- Deteccion de nota en vivo en formato europeo: Do, Re, Mi, Fa, Sol, La, Si.
- Afinador con desviacion en cents, frecuencia y nivel de entrada.
- Visualizacion de onda de sonido.
- Mapa musical de notas detectadas en la grabacion.
- Modo piano MIDI con samples locales de instrumentos, reproduccion de notas detectadas y capa opcional de voz original.
- Reproduccion de solo MIDI, sin la voz original.
- Importacion de archivos de audio locales para analizarlos y generar notas/MIDI sin grabar desde microfono.
- Editor MIDI para anadir notas manuales por instrumento, cambiar el instrumento de una nota o de toda la toma, y quitar la nota seleccionada o la ultima nota.
- Colores por instrumento en la lista de notas y en el piano roll.
- Eliminacion de tomas/canciones desde la pestaña de exportacion.
- Exportacion a WAV, WebM u OGG/MP4 segun navegador, MIDI, JSON y CSV.
- Macros de teclado: Espacio para grabar/pausar/reanudar, R para grabar/detener, P para reproducir voz y M para modo MIDI.

## Notas tecnicas

La deteccion de tono usa autocorrelacion sobre la entrada de microfono. En voces con mucho ruido, consonantes o vibrato fuerte, la app agrupa solo los tramos estables que superan el umbral de sensibilidad y la duracion minima configurada.

## Samples

Los samples de instrumentos incluidos vienen de FluidR3_GM mediante el proyecto `gleitz/midi-js-soundfonts`, con licencia Creative Commons Attribution 3.0 segun el proyecto fuente. La app incluye un subconjunto compacto por octavas y transpone el sample mas cercano para cada nota.
