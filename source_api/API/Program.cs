/*
 * the program class is console app that is the main entry point to start the application, it configures and launches the web api host and web server using
 * and instance of IHostBuilder
 */
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Threading;
using WebSocketLib;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //Start socketserver
            WebSocketServer webSocketServer = new WebSocketServer("0.0.0.0", 44351);
            webSocketServer.StartServer();

            var l_hostBuilder = CreateHostBuilder(args).Build();
            using (var scope = l_hostBuilder.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var projectDbContext = services.GetRequiredService(typeof(Data.EF.ProjectDbContext));
                    Data.EF.DbInitializer.SeedData(projectDbContext as Data.EF.ProjectDbContext);
                }
                catch (System.Exception)
                {

                }
            }
            l_hostBuilder.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder = webBuilder.UseUrls("http://0.0.0.0:44350");
                    webBuilder.UseStartup<Startup>();
                });
    }
}
/*
 * ref: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-3.1
 */
