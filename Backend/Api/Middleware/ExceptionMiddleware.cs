using KansoBoard.Api.Models;
using System.Net;
using System.Text.Json;

namespace KansoBoard.Api.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = null,
    };

    private static readonly Dictionary<string, string> CodeToLogMessage = new(StringComparer.Ordinal)
    {
        { "ERR_EMAIL_ALREADY_EXISTS", "Registration failed: email address already in use." },
        { "ERR_LOGIN_FAILED", "Login failed: invalid credentials." },
        { "ERR_REFRESH_TOKEN_INVALID", "Refresh failed: invalid or expired refresh token." },
        { "ERR_LOGOUT_FAILED", "Logout failed: user not found." },
        { "ERR_INVITATION_NOT_FOUND", "Invitation consume failed: invitation not found or expired." },
        { "ERR_INVITATION_CONSUME_FAILED", "Invitation consume failed." },
        { "ERR_USER_NOT_FOUND", "User not found." },
        { "ERR_PROJECT_NOT_FOUND", "Project not found." },
        { "ERR_BOARD_NOT_FOUND", "Board not found." },
        { "ERR_COLUMN_NOT_FOUND", "Column not found." },
        { "ERR_COLUMN_LOCKED", "Column cannot be deleted: it is locked." },
        { "ERR_CARD_NOT_FOUND", "Card not found." },
        { "ERR_CARD_MOVE_INVALID", "Card move failed: card not found or target column invalid." },
        { "ERR_CARD_TRANSFER_FAILED", "Card transfer failed: card or target board not found." },
        { "ERR_PROJECT_USER_NOT_FOUND", "Project member not found." },
        { "ERR_PROJECT_USER_ADD_FAILED", "Failed to add user to project." },
        { "ERR_API_KEY_NOT_FOUND", "API key not found." },
        { "ERR_UNKNOWN", "An unexpected error occurred." },
    };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var code = GetErrorCode(ex);
            var logMessage = CodeToLogMessage.TryGetValue(code, out var msg) ? msg : "An unexpected error occurred.";
            logger.LogError(ex, "Request failed: {LogMessage} (code: {Code})", logMessage, code);
            await WriteErrorResponseAsync(context, code);
        }
    }

    private static string GetErrorCode(Exception ex)
    {
        var msg = ex.Message.Trim();
        if (msg.StartsWith("ERR_", StringComparison.Ordinal))
            return msg;
        return "ERR_UNKNOWN";
    }

    private static async Task WriteErrorResponseAsync(HttpContext context, string code)
    {
        if (context.Response.HasStarted)
            return;

        var statusCode = code == "ERR_UNKNOWN" ? HttpStatusCode.InternalServerError : HttpStatusCode.BadRequest;

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new ErrorResponse { Message = code };
        await JsonSerializer.SerializeAsync(context.Response.Body, response, JsonOptions);
    }
}
