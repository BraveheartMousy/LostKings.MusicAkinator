using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace LostKings.MusicAkinator.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AudioController : ControllerBase
    {
        // GET api/audio/search
        [Route("search")]
        [HttpGet]
        [Throttle(Seconds = 5)]
        [EnableCors]
        public ActionResult<string> Search()
        {
            return Content("OK");
        }
    }
}