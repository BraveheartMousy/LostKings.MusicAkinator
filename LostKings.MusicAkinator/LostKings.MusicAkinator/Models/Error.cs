using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Models
{
    public class Error
    {
        public HttpStatusCode Status { get; set; }

        public string ErrorMessage { get; set; }
    }
}
