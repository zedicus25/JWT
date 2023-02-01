using StackExchange.Redis;

namespace JWT.Cache;

public class ConnectionHelper
{
    private static Lazy<ConnectionMultiplexer> _lazyConnection;

    public static ConnectionMultiplexer Connection => _lazyConnection.Value;
    
    static ConnectionHelper()
    {
        _lazyConnection = new Lazy<ConnectionMultiplexer>(() => {
            try
            {
                return ConnectionMultiplexer.Connect(ConfigurationManager.AppSettings["RedisUrl"]);
            }
            catch (Exception ex) { return null; }
        });
    }
}