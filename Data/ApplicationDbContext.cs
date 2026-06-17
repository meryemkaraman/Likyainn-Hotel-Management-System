using Likyainn.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace Likyainn.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Kullanici> Kullanicilar { get; set; }
    
    public DbSet<Rezervasyon> Rezervasyonlar { get; set; }
    }
    }