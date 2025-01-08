using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TempController : ControllerBase
{
   [Authorize]
   [HttpGet("identity")]
   public IActionResult Identity()
   {
      return Ok(User.Claims.Select(c => new { c.Type, c.Value }));
   }
}