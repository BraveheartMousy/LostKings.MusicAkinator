using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Net;

namespace LostKings.MusicAkinator.WebApi
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ThrottleAttribute : ActionFilterAttribute
    {
        public int Seconds { get; set; }
        public string Message { get; set; }

        private static MemoryCache Cache { get; } = new MemoryCache(new MemoryCacheOptions());

        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            IPAddress ipAddress = actionContext.HttpContext.Request.HttpContext.Connection.RemoteIpAddress;

            if (!Cache.TryGetValue(ipAddress, out bool entry))
            {
                MemoryCacheEntryOptions cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(TimeSpan.FromSeconds(Seconds));

                Cache.Set(ipAddress, true, cacheEntryOptions);
            }
            else
            {
                if (string.IsNullOrEmpty(Message))
                {
                    Message = "You can perform this action every {0} seconds.";
                }

                actionContext.Result = new ContentResult { Content = String.Format(Message, Seconds.ToString()) };
                actionContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            }
        }
    }
}
