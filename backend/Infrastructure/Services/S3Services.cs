using Amazon.S3;
using Amazon.S3.Model;
using backend.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace backend.Infrastructure.Services;

public class S3Services(IAmazonS3 s3Client, IOptions<S3Settings> s3Settings)
{
    private readonly IAmazonS3 _s3Client = s3Client;
    private readonly IOptions<S3Settings> _s3Settings = s3Settings;
    
    public async Task UploadFileAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        var putRequest = new PutObjectRequest
        {
            BucketName = _s3Settings.Value.BucketName,
            Key = fileName,
            ContentType = "application/pdf",
            InputStream = fileStream,
            Metadata =
            {
                ["file-name"] = fileName
            }
        };

        await _s3Client.PutObjectAsync(putRequest, cancellationToken);
    }

    public async Task<string> GetPresignedUrlAsync(string storageKey)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _s3Settings.Value.BucketName,
            Key = storageKey,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        return await _s3Client.GetPreSignedURLAsync(request);
    }
}