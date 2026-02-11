using KansoBoard.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace KansoBoard.Api.Extensions;

public static class ErrorResultExtensions
{
    public static IActionResult BadRequestError(this ControllerBase ctrl, string code) =>
        ctrl.BadRequest(new ErrorResponse { Message = code });

    public static IActionResult NotFoundError(this ControllerBase ctrl, string code) =>
        new ObjectResult(new ErrorResponse { Message = code }) { StatusCode = 404 };

    public static IActionResult UnauthorizedError(this ControllerBase ctrl, string code) =>
        new ObjectResult(new ErrorResponse { Message = code }) { StatusCode = 401 };
}
