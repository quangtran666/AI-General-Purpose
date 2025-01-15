namespace backend.Infrastructure.Options;

public class ApplicationConfig
{
    private readonly OpenAIConfig _openAIConfig = new();
    private readonly OpenAIEmbeddingsConfig _openAiEmbeddingsConfig = new();
    private readonly QdrantConfig _qdrantConfig = new();
    private readonly S3Settings _s3Settings = new();
    private readonly DbConfig _dbConfig = new();
    private readonly RagConfig _ragConfig = new();

    public ApplicationConfig(ConfigurationManager configurationManager)
    {
        configurationManager
            .GetRequiredSection($"AIServices:{OpenAIConfig.ConfigSectionName}")
            .Bind(_openAIConfig);
        
        configurationManager
            .GetRequiredSection($"AIServices:{OpenAIEmbeddingsConfig.ConfigSectionName}")
            .Bind(_openAiEmbeddingsConfig);
        
        configurationManager
            .GetRequiredSection($"VectorStores:{QdrantConfig.ConfigSectionName}")
            .Bind(_qdrantConfig);
        
        configurationManager
            .GetRequiredSection("S3Settings")
            .Bind(_s3Settings);
        
        configurationManager
            .GetRequiredSection(DbConfig.ConfigSectionName)
            .Bind(_dbConfig);
        
        configurationManager
            .GetRequiredSection(RagConfig.ConfigSectionName)
            .Bind(_ragConfig);
    }
    
    public OpenAIConfig OpenAIConfig => _openAIConfig;
    public OpenAIEmbeddingsConfig OpenAiEmbeddingsConfig => _openAiEmbeddingsConfig;
    public QdrantConfig QdrantConfig => _qdrantConfig;
    public S3Settings S3Settings => _s3Settings;
    public DbConfig DbConfig => _dbConfig;
    public RagConfig RagConfig => _ragConfig;
}