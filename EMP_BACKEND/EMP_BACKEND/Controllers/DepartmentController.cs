using EMP_BACKEND.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EMP_BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DepartmentContext _departmentContext;
        public DepartmentController(DepartmentContext departmentContext)
        {
            _departmentContext = departmentContext;
        }

        //APIs

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            if (_departmentContext.Departments == null)
            {
                return NotFound();
            }
            return await _departmentContext.Departments.ToListAsync();
        }

        [HttpGet("{dcode}")]
        public async Task<ActionResult<Department>> GetDepartment(string dcode)
        {
            if (_departmentContext.Departments == null)
            {
                return NotFound();
            }
            var department = await _departmentContext.Departments.FindAsync(dcode);
            if (department == null)
            {
                return NotFound();
            }
            return department;
        }

        [HttpPost]
        public async Task<ActionResult<Department>> PostEmployee(Department department)
        {
            _departmentContext.Departments.Add(department);
            await _departmentContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDepartment), new { dcode = department.Dcode }, department);
        }

        [HttpPut("{dcode}")]
        public async Task<ActionResult> PutEmployee(string dcode, Department department)
        {
            if (dcode != department.Dcode)
            {
                return BadRequest();
            }

            _departmentContext.Entry(department).State = EntityState.Modified;
            try
            {
                await _departmentContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();
        }

        [HttpDelete("{dcode}")]
        public async Task<ActionResult> DeleteEmployee(string dcode)
        {
            if (_departmentContext.Departments == null)
            {
                return NotFound();
            }
            var department = await _departmentContext.Departments.FindAsync(dcode);
            if (department == null)
            {
                return NotFound();
            }
            _departmentContext.Departments.Remove(department);
            await _departmentContext.SaveChangesAsync();

            return Ok();
        }
    }
}
