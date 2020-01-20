using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Models
{
    public class Song
    {
        public int SortNumber { get; set; }
        public string Title { get; set; }
        public string Artist { get; set; }
        public string PreviewLink { get; set; }
    }
}
