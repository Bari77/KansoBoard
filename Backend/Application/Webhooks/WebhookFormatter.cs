using KansoBoard.Domain.Entities;

namespace KansoBoard.Application.Webhooks
{
    public static class WebhookFormatter
    {
        public static object StandardizedCardPayload(string hookType, Project project, Board board, Column column, Card card, User? assigned = null)
        {
            return new
            {
                hookType,
                timestamp = DateTime.UtcNow,
                project = new
                {
                    id = project.Id,
                    name = project.Name
                },
                board = new
                {
                    id = board.Id,
                    name = board.Name,
                },
                column = new
                {
                    id = column.Id,
                    name = column.Name,
                },
                card = new
                {
                    id = card.Id,
                    number = card.Number,
                    title = card.Title,
                    description = card.Description,
                    type = card.Type.ToString(),
                    priority = card.Priority.ToString(),
                },
                assigned = assigned == null ? null : new
                {
                    id = assigned.Id,
                    pseudo = assigned.Pseudo,
                    avatar = assigned.AvatarUrl,
                }
            };
        }
    }
}
