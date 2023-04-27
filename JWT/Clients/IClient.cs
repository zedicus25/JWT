namespace JWT.Clients
{
    public interface IClient
    {
        Task<UploadingResponce> SendFile(IFormFile file);
        string GetFileUrl(string fileId);
    }
}
