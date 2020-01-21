using LostKings.MusicAkinator.WebApi.Models;
using Microsoft.Extensions.Configuration;
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
        private readonly string _token;
        private readonly static string _urlParam = "findLyrics/?api_token=";
        private readonly static string _statusSuccess = "success";
        private readonly static int _maxSongListLength = 5;

        public AuddService(HttpClient httpClient, IConfiguration token)
        {
            _httpClient = httpClient;
            _token = token.GetValue<string>("AuddService:token");
        }

        public async Task<AuddResponse> GetSongs(string songText)
        {
            var responseString = await _httpClient.GetStringAsync(_urlParam + _token + "&q=" + songText);

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
