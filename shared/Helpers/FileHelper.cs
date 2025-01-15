namespace shared.Helpers;

public class FileHelper
{
    public static async Task<byte[]> ReadStreamToByteArrayAysnc(Stream stream, CancellationToken cancellationToken)
    {
        using var memoryStream = new MemoryStream();
        await stream.CopyToAsync(memoryStream, cancellationToken);
        return memoryStream.ToArray();
    }
}