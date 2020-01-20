using LostKings.MusicAkinator.WebApi.Models;
using LostKings.MusicAkinator.WebApi.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : ControllerBase
    {
        private IAuddService _auddService;
        private IDeezerService _deezerService;

        public AudioController(IAuddService auddService, IDeezerService deezerService)
        {
            _auddService = auddService ?? throw new ArgumentNullException(nameof(auddService));
            _deezerService = deezerService ?? throw new ArgumentNullException(nameof(deezerService));
        }

        // GET api/audio/search
        [Route("search")]
        [HttpGet]
        [Throttle(Seconds = 5)]
        public ActionResult<string> Search(string songText)
        {
            var songs = new Response();
            var songList = new List<Song>();
            AuddResponse auddResponse = _auddService.GetSongs(songText).Result;
            int i = 0;
            foreach (AuddSong song in auddResponse.Result)
            {
                DeezerResponse dezzerResponse = _deezerService.GetSong(song.Title, song.Artist).Result;
                songList.Add(new Song()
                {
                    SortNumber = i,
                    Artist = song.Artist,
                    Title = song.Title,
                    PreviewLink = dezzerResponse.Data.FirstOrDefault()?.Preview
                });
                i++;
            }
            songs.Status = HttpStatusCode.OK;
            songs.Result = songList;
            return new JsonResult(songs);
        }
    }
}