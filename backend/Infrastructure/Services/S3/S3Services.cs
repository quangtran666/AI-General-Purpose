using Amazon.S3;
using Amazon.S3.Model;
using backend.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace backend.Infrastructure.Services;

public class S3Services(IAmazonS3 s3Client, ApplicationConfig applicationConfig)
{
    private readonly IAmazonS3 _s3Client = s3Client;
    private readonly ApplicationConfig _applicationConfig = applicationConfig;
    
    public async Task UploadFileAsync(Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        var putRequest = new PutObjectRequest
        {
            BucketName = _applicationConfig.S3Settings.BucketName,
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
            BucketName = _applicationConfig.S3Settings.BucketName,
            Key = storageKey,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        return await _s3Client.GetPreSignedURLAsync(request);
    }
}