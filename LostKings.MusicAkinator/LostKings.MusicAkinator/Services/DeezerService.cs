using LostKings.MusicAkinator.WebApi.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Services
{
    public class DeezerService : IDeezerService
    {
        private readonly HttpClient _httpClient;
        private readonly static string _uri = "search?q=";
        private readonly static string _artist = "artist:";
        private readonly static string _track = "track:";

        public DeezerService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<DeezerResponse> GetSong(string title, string artist)
        {
            var responseString = await _httpClient.GetStringAsync(_uri + _artist + '"' + artist +
                    "\" " + _track + '"' + title + '"');
            var response = JsonConvert.DeserializeObject<DeezerResponse>(responseString);
            return response;
        }
    }
}
