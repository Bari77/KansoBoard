namespace Domain.Entities
{
    public class ProjectCounter
    {
        public Guid ProjectId { get; set; }
        public uint NextCardNumber { get; set; }
    }
}
