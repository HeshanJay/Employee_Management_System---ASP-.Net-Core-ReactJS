using System.ComponentModel.DataAnnotations;

namespace EMP_BACKEND.Models
{
    public class Department
    {
        [Key]
        public string? Dcode { get; set; }
        public string? Dname { get; set; }
    }
}
