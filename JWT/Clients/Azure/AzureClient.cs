using Domain.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage;

namespace JWT.Clients.Azure
{
    public class AzureClient : IClient
    {
        public async Task<UploadingResponce> SendFile(IFormFile file)
        {
            try
            {
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings.GetConnectionString("AzureBlobConnection"));
                CloudBlobClient client = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = client.GetContainerReference(ConfigurationManager.AppSettings.GetConnectionString("AzureContainerName"));
                bool isCreated = await container.CreateIfNotExistsAsync();
                await container.SetPermissionsAsync(new BlobContainerPermissions
                { PublicAccess = BlobContainerPublicAccessType.Blob });
                string blobName = "";
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    memoryStream.Position = 0;
                    blobName = Guid.NewGuid().ToString() + "_" + file.FileName;
                    CloudBlockBlob blob = container.GetBlockBlobReference(blobName);
                    string mimeType = "application/unknown";
                    string ext = blobName.Contains(".") ?
                                Path.GetExtension(blobName).ToLower() : "." + blobName;
                    Microsoft.Win32.RegistryKey regKey =
                                Microsoft.Win32.Registry.ClassesRoot.OpenSubKey(ext);
                    if (regKey != null && regKey.GetValue("Content Type") != null)
                        mimeType = regKey.GetValue("Content Type").ToString();

                    memoryStream.ToArray();
                    memoryStream.Seek(0, SeekOrigin.Begin);
                    blob.Properties.ContentType = mimeType;
                    await blob.UploadFromStreamAsync(memoryStream);
                }
                return new UploadingResponce { IsSuccess = true, FileName = blobName };
            }
            catch (Exception)
            {
                return new UploadingResponce { IsSuccess = false, FileName = "" };
            }
        }

        public string GetFileUrl(string fileId)
        {
            string fileUrl = "";

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings.GetConnectionString("AzureBlobConnection"));

            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            CloudBlobContainer container = blobClient.GetContainerReference(ConfigurationManager.AppSettings.GetConnectionString("AzureContainerName"));

            try
            {
                CloudBlobDirectory dira = container.GetDirectoryReference(string.Empty);
                var rootDirFolders = dira.ListBlobsSegmentedAsync(true, BlobListingDetails.Metadata, null, null, null, null).Result;

                IListBlobItem item =
                    rootDirFolders.Results.FirstOrDefault(x => x.Uri.AbsoluteUri.EndsWith(fileId));

                if (item != null)
                {
                    fileUrl = item.Uri.AbsoluteUri;
                }

            }
            catch (Exception)
            {
            }
            return fileUrl;
        }
    }
}
