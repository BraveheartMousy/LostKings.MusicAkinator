using LostKings.MusicAkinator.WebApi.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace LostKings.MusicAkinator.WebApi.Services
{
    public interface IAuddService
    {
        Task<AuddResponse> GetSongs(string songText);
    }
}
