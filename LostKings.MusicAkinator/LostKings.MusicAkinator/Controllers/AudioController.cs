using LostKings.MusicAkinator.WebApi.Models;
using LostKings.MusicAkinator.WebApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

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
            try
            {
                var songs = new Response();
                var songList = new List<Song>();
                AuddResponse auddResponse = _auddService.GetSongs(songText).Result;
                int i = 0;
                foreach (AuddSong song in auddResponse.Result)
                {
                    if (!string.IsNullOrEmpty(song.Artist) && !string.IsNullOrEmpty(song.Title))
                    {
                        string artist = song.Artist.Split('(')[0];
                        string title = song.Title.Split('(')[0];
                        DeezerResponse dezzerResponse = _deezerService.GetSong(title, artist).Result;
                        string preview = dezzerResponse.Data.FirstOrDefault()?.Preview;
                        if (!string.IsNullOrEmpty(preview))
                        {                            
                            songList.Add(new Song()
                            {
                                SortNumber = i,
                                Artist = artist,
                                Title = title,
                                PreviewLink = preview
                            });
                            i++;
                        }
                    }
                }
                if (!songList.Any())
                {
                    return new NoContentResult();
                }
                songs.Status = HttpStatusCode.OK;
                songs.Result = songList;
                return new JsonResult(songs);
            }
            catch (Exception ex)
            {                
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}