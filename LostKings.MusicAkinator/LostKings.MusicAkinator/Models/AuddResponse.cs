using System;
using System.Collections.Generic;
using System.Text;

namespace LostKings.MusicAkinator.WebApi.Models
{
    public class AuddResponse
    {
        public string Status { get; set; }

        public List<AuddSong> Result { get; set; }
    }
}
