using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Text;

internal static class Program
{
    private const int DefaultPort = 5174;

    private static async Task<int> Main(string[] args)
    {
        var openBrowser = !args.Contains("--no-open", StringComparer.OrdinalIgnoreCase);
        var preferredPort = ParsePort(args) ?? DefaultPort;

        using var shutdown = new CancellationTokenSource();
        Console.CancelKeyPress += (_, eventArgs) =>
        {
            eventArgs.Cancel = true;
            shutdown.Cancel();
        };

        using var server = StartServer(preferredPort, out var port);
        var url = $"http://127.0.0.1:{port}/";

        Console.Title = "AudioNotes";
        Console.WriteLine("AudioNotes esta ejecutandose.");
        Console.WriteLine($"URL: {url}");
        Console.WriteLine("Cierra esta ventana para detener la aplicacion.");

        if (openBrowser)
        {
            OpenBrowser(url);
        }

        try
        {
            await ServeAsync(server, shutdown.Token);
        }
        catch (OperationCanceledException)
        {
            return 0;
        }
        catch (ObjectDisposedException)
        {
            return 0;
        }

        return 0;
    }

    private static int? ParsePort(string[] args)
    {
        for (var i = 0; i < args.Length - 1; i++)
        {
            if (args[i].Equals("--port", StringComparison.OrdinalIgnoreCase) &&
                int.TryParse(args[i + 1], out var port) &&
                port is > 0 and < 65536)
            {
                return port;
            }
        }

        return null;
    }

    private static TcpListener StartServer(int preferredPort, out int port)
    {
        for (var candidate = preferredPort; candidate < preferredPort + 100; candidate++)
        {
            try
            {
                var listener = new TcpListener(IPAddress.Loopback, candidate);
                listener.Start();
                port = candidate;
                return listener;
            }
            catch (SocketException)
            {
                // Try the next local port.
            }
        }

        throw new InvalidOperationException("No hay puertos locales libres para iniciar AudioNotes.");
    }

    private static async Task ServeAsync(TcpListener server, CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            var client = await server.AcceptTcpClientAsync(cancellationToken);
            _ = Task.Run(() => HandleClientAsync(client, cancellationToken), cancellationToken);
        }
    }

    private static async Task HandleClientAsync(TcpClient client, CancellationToken cancellationToken)
    {
        using var _ = client;
        var stream = client.GetStream();
        var requestBuffer = new byte[8192];
        var read = await stream.ReadAsync(requestBuffer, cancellationToken);
        if (read <= 0)
        {
            return;
        }

        var request = Encoding.ASCII.GetString(requestBuffer, 0, read);
        var firstLine = request.Split("\r\n", 2, StringSplitOptions.None)[0];
        var parts = firstLine.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2 || !parts[0].Equals("GET", StringComparison.OrdinalIgnoreCase))
        {
            await WriteResponseAsync(stream, 405, "Method Not Allowed", "text/plain", Encoding.UTF8.GetBytes("Method Not Allowed"), cancellationToken);
            return;
        }

        var path = NormalizePath(parts[1]);
        if (path == "/favicon.ico")
        {
            await WriteHeaderAsync(stream, 204, "No Content", "text/plain", 0, cancellationToken);
            return;
        }

        var asset = LoadAsset(path);
        if (asset is null)
        {
            await WriteResponseAsync(stream, 404, "Not Found", "text/plain", Encoding.UTF8.GetBytes("Not Found"), cancellationToken);
            return;
        }

        await WriteResponseAsync(stream, 200, "OK", asset.Value.ContentType, asset.Value.Bytes, cancellationToken);
    }

    private static string NormalizePath(string rawPath)
    {
        var path = rawPath.Split('?', 2)[0];
        path = Uri.UnescapeDataString(path);
        if (path is "/" or "")
        {
            return "/index.html";
        }

        return path.StartsWith('/') ? path : "/" + path;
    }

    private static (byte[] Bytes, string ContentType)? LoadAsset(string path)
    {
        var normalizedPath = path.TrimStart('/').Replace('\\', '/');
        if (normalizedPath.StartsWith("samples/", StringComparison.OrdinalIgnoreCase))
        {
            return LoadEmbeddedResource(normalizedPath, ContentTypeFor(path));
        }

        var resourceName = path.ToLowerInvariant() switch
        {
            "/index.html" => "index.html",
            "/styles.css" => "styles.css",
            "/app.js" => "app.js",
            "/readme.md" => "README.md",
            _ => null
        };

        if (resourceName is null)
        {
            return null;
        }

        return LoadEmbeddedResource(resourceName, ContentTypeFor(path));
    }

    private static (byte[] Bytes, string ContentType)? LoadEmbeddedResource(string resourceName, string contentType)
    {
        var assembly = Assembly.GetExecutingAssembly();
        var resolvedName = assembly.GetManifestResourceNames()
            .FirstOrDefault(name => string.Equals(
                name.Replace('\\', '/'),
                resourceName.Replace('\\', '/'),
                StringComparison.OrdinalIgnoreCase));
        using var stream = resolvedName is null ? null : assembly.GetManifestResourceStream(resolvedName);
        if (stream is null)
        {
            return null;
        }

        using var memory = new MemoryStream();
        stream.CopyTo(memory);
        return (memory.ToArray(), contentType);
    }

    private static string ContentTypeFor(string path)
    {
        return path.ToLowerInvariant() switch
        {
            "/index.html" => "text/html; charset=utf-8",
            "/styles.css" => "text/css; charset=utf-8",
            "/app.js" => "application/javascript; charset=utf-8",
            "/readme.md" => "text/markdown; charset=utf-8",
            _ when path.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) => "audio/mpeg",
            _ => "application/octet-stream"
        };
    }

    private static async Task WriteResponseAsync(
        NetworkStream stream,
        int statusCode,
        string reason,
        string contentType,
        byte[] body,
        CancellationToken cancellationToken)
    {
        await WriteHeaderAsync(stream, statusCode, reason, contentType, body.Length, cancellationToken);
        if (body.Length > 0)
        {
            await stream.WriteAsync(body, cancellationToken);
        }
    }

    private static async Task WriteHeaderAsync(
        NetworkStream stream,
        int statusCode,
        string reason,
        string contentType,
        int contentLength,
        CancellationToken cancellationToken)
    {
        var header =
            $"HTTP/1.1 {statusCode} {reason}\r\n" +
            $"Content-Type: {contentType}\r\n" +
            $"Content-Length: {contentLength}\r\n" +
            "Cache-Control: no-store\r\n" +
            "Connection: close\r\n\r\n";
        await stream.WriteAsync(Encoding.ASCII.GetBytes(header), cancellationToken);
    }

    private static void OpenBrowser(string url)
    {
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true
            });
        }
        catch (Exception error)
        {
            Console.WriteLine($"No se pudo abrir el navegador automaticamente: {error.Message}");
            Console.WriteLine("Abre la URL manualmente.");
        }
    }
}
