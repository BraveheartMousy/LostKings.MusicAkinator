using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Models
{
    public class Response
    {
        public HttpStatusCode Status { get; set; }

        public List<Song> Result { get; set; }
    }
}
