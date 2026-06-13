$ErrorActionPreference = "Stop"

$project = Join-Path $PSScriptRoot "launcher\AudioNotes.Launcher.csproj"
$output = Join-Path $PSScriptRoot "dist\AudioNotes"

dotnet publish $project `
  -c Release `
  -r win-x64 `
  --self-contained true `
  -p:PublishSingleFile=true `
  -p:EnableCompressionInSingleFile=true `
  -p:DebugType=None `
  -p:DebugSymbols=false `
  -o $output

if ($LASTEXITCODE -ne 0) {
  throw "dotnet publish failed with exit code $LASTEXITCODE"
}

Write-Host "Ejecutable generado en: $output\AudioNotes.exe"
