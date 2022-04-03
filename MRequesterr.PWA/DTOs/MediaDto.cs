namespace MRequesterr.DTOs
{
    public class MediaDto
    {
        public int Id { get; set; }
        public int TmdbId { get; set; }
        public string ImdbId { get; set; }
        public string Title { get; set; }
        public string CleanTitle { get; set; }
        public string SortTitle { get; set; }
        public string Status { get; set; }
        public string Overview { get; set; }
        public bool Monitored { get; set; }
        public string MinimumAvailability { get; set; }
        public int ProfileId { get; set; }
        public DateTime? LastInfoSync { get; set; }
        public int Runtime { get; set; }
        public MediaImage[] Images { get; set; }
        public string TitleSlug { get; set; }
        public string Website { get; set; }
        public string Path { get; set; }
        public int Year { get; set; }
        public List<string> Genres { get; set; }
    }

    public class MediaImage
    {
        public string CoverType { get; set; }
        public string Url { get; set; }
    }
}
