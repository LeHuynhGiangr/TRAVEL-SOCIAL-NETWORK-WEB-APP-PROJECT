/*
 * the Startup class configures the request pipeline of the application, dependency injection and how all requests are handled.
 */
using API.Hub;
using Data.EF;
using Data.Entities;
using Data.Enums;
using Data.Interfaces;
using Domain.IServices;
using Domain.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Security.Claims;
using System.Web;

namespace API
{
    public class Startup
    {
        public IConfiguration Configuration { get; set; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddHttpClient();
            services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.IgnoreNullValues = true);

            //services.AddIdentity<User, Role>()
            //    .AddEntityFrameworkStores<ProjectDbContext>().AddDefaultTokenProviders();
            //services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);
            services.AddAuthentication(_ =>
            {
                _.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                _.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(_ =>
            {
                _.RequireHttpsMetadata = false;
                _.SaveToken = true;
                _.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.ASCII.GetBytes("S#$33ab654te^#^$KD%^64")),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            //register group of services with extension methods
            services.AddDbContext<ProjectDbContext>(
                _ => _.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection"), 
                    _ => _.MigrationsAssembly("source_api.Data.EF")
                    ));

            //services.AddControllers();

            //services.AddSwaggerGen();

            services.AddCors();//***

            //configure Dependency Injection for services
            services.AddScoped<EFRepository<User, Guid>, EFRepository<User, Guid>>();
            services.AddScoped<EFRepository<Post, Guid>, EFRepository<Post, Guid>>();
            services.AddScoped<EFRepository<Trip, Guid>, EFRepository<Trip, Guid>>();
            services.AddScoped<EFRepository<UserMedia, Guid>, EFRepository<UserMedia, Guid>>();
            services.AddScoped<EFRepository<UserJoinTrip, Guid>, EFRepository<UserJoinTrip, Guid>>();
            services.AddScoped<EFRepository<Page, Guid>, EFRepository<Page, Guid>>();
            services.AddScoped<EFRepository<ReviewPage, Guid>, EFRepository<ReviewPage, Guid>>();
            services.AddScoped<EFRepository<UserFollowPage, Guid>, EFRepository<UserFollowPage, Guid>>();
            services.AddScoped<EFRepository<Notification, Guid>, EFRepository<Notification, Guid>>();
            services.AddScoped<EFRepository<Discount, Guid>, EFRepository<Discount, Guid>>();

            services.AddScoped<IRepository<Friend, Guid>, EFRepository<Friend, Guid>>();
            services.AddScoped<IUserService<Guid>, UserService>();
            services.AddScoped<IPostService<Guid>, PostService>();
            services.AddScoped<ITripService<Guid>, TripService>();
            services.AddScoped<IMediaService<Guid>, MediaService>();
            services.AddScoped<IUserJoinTripService<Guid>, UserJoinTripService>();
            services.AddScoped<IPageService<Guid>, PageService>();
            services.AddScoped<IFriendService<Guid>, FriendService>();
            services.AddScoped<IRatingService<Guid>, RatingService>();
            services.AddScoped<IUserFollow<Guid>, UserFollowPageService>();
            services.AddScoped<INotificationService<Guid>, NotificationService>();
            services.AddScoped<IDiscountService<Guid>, DiscountService>();
            services.AddScoped<IRepository<ChatBox, Guid>, EFRepository<ChatBox, Guid>>();
            services.AddScoped<IRepository<UserChatBox, Guid>, EFRepository<UserChatBox, Guid>>();
            services.AddScoped<IChatService<Guid>, ChatService>();

            services.AddAuthentication(options =>
            {
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
              .AddCookie(options =>
              {
                  options.LoginPath = "/account/google-login"; // Must be lowercase
              }) 
            .AddGoogle(config =>
              {
                  config.ClientId = Configuration["Authentication:Google:Client_Id"];
                  config.ClientSecret = Configuration["Authentication:Google:Client_Secret"];

                  config.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "UserId");
                  config.ClaimActions.MapJsonKey(ClaimTypes.Email, "EmailAddress", ClaimValueTypes.Email);
                  config.ClaimActions.MapJsonKey(ClaimTypes.Name, "Name");
              });
            services.AddSignalR();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //ASP.NET Core controllers use the Routing middleware to match the URLs of incoming requests and map them to actions.Routes templates:
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // generated swagger json and swagger ui middleware
            // Enable middleware to serve generated Swagger as a JSON endpoint.
            //app.UseSwagger();
            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            //app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", "ASP.NET Core Sign-up and Verification API"));

            //app.UseRouting();

            // global cors policy
            app.UseCors(x => x
                .SetIsOriginAllowed(origin => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            app.UseRouting();

            //try using static files without authorization
            //app.UseStaticFiles(new StaticFileOptions
            //{
            //    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
            //         System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "StaticFiles")),
            //    RequestPath = "/53746174696346696c6573"
            //});

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseStaticFiles();
            app.UseMiddleware<JwtMiddleware>();

            ////try using webSocket
            //app.UseWebSockets(new WebSocketOptions { 
            //    KeepAliveInterval=TimeSpan.FromSeconds(120),//How frequently to send "ping" frames to the client to ensure proxies keep the connection open. The default is two minutes.
            //    ReceiveBufferSize= 4096, // 1024 byte * 4 = 4kb

            //});

            //app.Use(async (context, next) => {
            //    if (context.Request.Path == "/ws")// webSocket only accepts request for /ws
            //    {
            //        if (context.WebSockets.IsWebSocketRequest)
            //        {
            //            var wsHelper = new WebSocketHelpers.SendReceiveHandler(context, System.Diagnostics.Activity.Current.Id);
            //            await wsHelper.Echo();//main handling
            //        }
            //        else
            //        {
            //            context.Response.StatusCode = 400;
            //        }
            //    }
            //    else
            //    {
            //        await next();
            //    }
            //});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<HubClient>("/triprt");
            });
        }
    }
}
/*
 * 
 * https://docs.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-3.1
 * https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses
 * problems: WWW-Authenticate, cofiguring authentication schema in asp.net core
 * 
 * webSocket -> ref:https://docs.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-3.1
 */
