using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using OutOfOffice.Server.Models.SQLmodels;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Employee> Employees { get; set; }
    public virtual DbSet<ApprovalRequest> ApprovalRequests { get; set; }
    public virtual DbSet<LeaveRequest> LeaveRequests { get; set; }
    public virtual DbSet<Project> Projects { get; set; }
    public virtual DbSet<ProjectDetails> ProjectsDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //modelBuilder.Entity<ApplicationUser>()
        //    .HasOne(u => u.Employee)
        //    .WithMany()
        //    .HasForeignKey(u => u.EmployeeId)
        //    .OnDelete(DeleteBehavior.Restrict);

        //modelBuilder.Entity<Employee>()
        //    .HasOne(e => e.Partner)
        //    .WithMany()
        //    .HasForeignKey(e => e.EmployeePartner)
        //    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ApprovalRequest>()
            .Property(req => req.Status)
            .HasConversion<string>()
            .HasMaxLength(50);

        modelBuilder.Entity<ApplicationUser>().HasDiscriminator<string>("Discriminator").HasValue<ApplicationUser>("ApplicationUser");

        base.OnModelCreating(modelBuilder);
        modelBuilder
        .Entity<Employee>()
        .ToTable(tb => tb.HasTrigger("trg_CheckEmployeePartner"));
    }
}
