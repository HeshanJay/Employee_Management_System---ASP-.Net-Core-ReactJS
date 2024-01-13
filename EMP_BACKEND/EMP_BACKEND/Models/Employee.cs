using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EMP_BACKEND.Models
{
    public class Employee
    {
        [Key]
        public string? Eid { get; set; }
        public string? Dcode { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? DateOfBirth { get; set; }
        public int? Age { get; set; }
        public string? EmployeeType { get; set; }
        public int? Salary { get; set; }
    }
}
