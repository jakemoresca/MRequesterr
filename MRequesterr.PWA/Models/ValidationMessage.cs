namespace MRequesterr.Models
{
    public class ValidationMessage
    {
        public ValidationMessage(string message, bool isError = false)
        {
            Message = message;
            IsError = isError;
        }

        public string Message { get; set; }
        public bool IsError { get; set; }
    }
}
