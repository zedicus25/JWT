using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

namespace JWT.Clients.AWS
{
    public class AwsClient : IClient
    {
        private readonly RegionEndpoint _region;
        private readonly string _bucketName;
        private readonly AmazonS3Client _s3Client;
        public AwsClient()
        {
            _region = RegionEndpoint.EUWest2;
            _bucketName = ConfigurationManager.AppSettings["Amazon:BusketName"];
            _s3Client = new AmazonS3Client(ConfigurationManager.AppSettings["Amazon:AccessKey"],
                ConfigurationManager.AppSettings["Amazon:SecretKey"], _region);
        }

        public string GetFileUrl(string fileId) => $"https://{_bucketName}.s3.amazonaws.com/{fileId}";

        public async Task<UploadingResponce> SendFile(IFormFile file)
        {
            string fileKey = Guid.NewGuid().ToString() + "_" + file.FileName;
            try
            {
                using (var newMemoryStream = new MemoryStream())
                {
                    file.CopyTo(newMemoryStream);

                    var uploadRequest = new TransferUtilityUploadRequest
                    {
                        InputStream = newMemoryStream,
                        Key = fileKey,
                        BucketName = ConfigurationManager.AppSettings["Amazon:BusketName"],
                        TagSet = new List<Tag>() { new Tag() { Key = "public", Value = "yes" } }
                    };

                    var fileTransferUtility = new TransferUtility(_s3Client);
                    await fileTransferUtility.UploadAsync(uploadRequest);
                }

                return new()
                {
                    IsSuccess = true,
                    FileName = fileKey,
                };
            }
            catch (Exception)
            {

                return new()
                {
                    IsSuccess = false,
                    FileName = "",
                };
            }
            

        }
    }
}
