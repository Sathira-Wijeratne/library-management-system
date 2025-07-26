namespace library_management_system.Server.Data.Entities
{
    public class Book
    {
        // Entity Framework will consider Id as primary key automatically
        public int Id { get; set; }
        public string title { get; set; }
        public string author { get; set; }
        public string description{ get; set; }
    }
}
