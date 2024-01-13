using Microsoft.EntityFrameworkCore;

namespace EMP_BACKEND.Models
{
    public class DepartmentContext : DbContext
    {
        public DepartmentContext(DbContextOptions<DepartmentContext> options) : base(options)
        {

        }
        public DbSet<Department> Departments { get; set; }
    }
}
