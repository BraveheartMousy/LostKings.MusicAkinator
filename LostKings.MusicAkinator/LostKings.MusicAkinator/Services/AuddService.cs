using LostKings.MusicAkinator.WebApi.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Services
{
    public class AuddService : IAuddService
    {
        private readonly HttpClient _httpClient;
        private readonly static string _urlParam = "findLyrics/?q=";
        private readonly static string _statusSuccess = "success";
        private readonly static int _maxSongListLength = 5;

        public AuddService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<AuddResponse> GetSongs(string songText)
        {
            var responseString = await _httpClient.GetStringAsync(_urlParam + songText);

            var response = JsonConvert.DeserializeObject<AuddResponse>(responseString);

            if (response?.Status == _statusSuccess)
            {
                response.Result.RemoveRange(_maxSongListLength, response.Result.Count - _maxSongListLength);
            }
            else
            {
                throw new Exception(responseString);
            }
            return response;
        }
    }
}
