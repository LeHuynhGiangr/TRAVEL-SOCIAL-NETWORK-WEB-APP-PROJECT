using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
namespace API.Hub
{
    public class HubClient : Hub<IHubClient>
    {

    }
}
