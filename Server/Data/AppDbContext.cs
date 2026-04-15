using System;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<AppUser> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) 
        {
            
        } 

    }
}
