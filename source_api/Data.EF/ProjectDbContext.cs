/*
 * Configuring database context
 */
using Data.EF.Configurations;
using Data.Entities;
using Data.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Data.EF
{
    public class ProjectDbContext : IdentityDbContext<User, Role, System.Guid>
    {
        public ProjectDbContext(DbContextOptions dbContextOption) : base(dbContextOption)
        {
        }

        //start declare entities 
        public override DbSet<User> Users { get; set; }
        public override DbSet<Role> Roles { get; set; }
        public DbSet<UserMedia> UserMedias { get; set; }
        public DbSet<PostComment> PostComments { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<TimeLine> TimeLines { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Page> Pages { get; set; }
        public DbSet<PageType> PageTypes { get; set; }
        public DbSet<Card> Cards { get; set; }
        public DbSet<PaymentHistory> PaymentHistories { get; set; }
        public DbSet<TripMedia> TripMedias { get; set; }
        public DbSet<ReviewTrip> ReviewTrips { get; set; }
        public DbSet<UserJoinTrip> UserJoinTrips { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<OTP> OTPs { get; set; }

        public DbSet<ReviewPage> ReviewPages { get; set; }

        public DbSet<ChatBox> ChatBoxes { get; set; }
        public DbSet<UserChatBox> UserChatBoxes { get; set; }
        //end declare entites

        //this method is called on event model creating
        //take an instance of ModelBuilder as a parameter, this is called by framework when db-context is first created to build the model and its mappings in memory.
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //start configure using fluent API
            builder.ApplyConfiguration(new RefreshTokenConfiguration());
            builder.ApplyConfiguration(new UserConfiguration());
            builder.ApplyConfiguration(new RoleConfiguration());
            builder.ApplyConfiguration(new PostConfiguration());
            builder.ApplyConfiguration(new ChatBoxConfiguration());
            builder.ApplyConfiguration(new FriendConfiguration());
            builder.ApplyConfiguration(new UserChatBoxConfiguration());

            builder.Entity<IdentityUserClaim<Guid>>().ToTable("userclaims");
            builder.Entity<IdentityUserLogin<Guid>>().ToTable("userlogins").HasKey(_ => _.UserId);
            builder.Entity<IdentityUserRole<Guid>>().ToTable("userroles").HasKey(_ => new { _.UserId, _.RoleId });
            builder.Entity<IdentityRoleClaim<Guid>>().ToTable("roleclaims");
            builder.Entity<IdentityUserToken<Guid>>().ToTable("usertokens").HasKey(_ => _.UserId);

            builder.Entity<UserJoinTrip>().HasKey(sc => new { sc.TripId, sc.Id });

            builder.Entity<UserJoinTrip>()
                .HasOne(sc => sc.User)
                .WithMany(s => s.UserJoinTrips)
                .HasForeignKey(sc => sc.Id).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserJoinTrip>()
                .HasOne(sc => sc.Trip)
                .WithMany(s => s.UserJoinTrips)
                .HasForeignKey(sc => sc.TripId).OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Trip>()
               .HasOne(sc => sc.Page)
               .WithMany(s => s.Trips)
               .HasForeignKey(sc => sc.PageId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<Trip>()
              .HasOne(sc => sc.User)
              .WithMany(s => s.Trips)
              .HasForeignKey(sc => sc.UserId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ReviewPage>()
              .HasOne(sc => sc.Page)
              .WithMany(s => s.ReviewPages)
              .HasForeignKey(sc => sc.PageId).OnDelete(DeleteBehavior.Restrict);
            builder.Entity<ReviewPage>()
              .HasOne(sc => sc.User)
              .WithMany(s => s.ReviewPages)
              .HasForeignKey(sc => sc.UserId).OnDelete(DeleteBehavior.Restrict);
        }

        public override int SaveChanges()
        {
            //auto add created datetime or update modified datetime
            var l_modifiedEntities = ChangeTracker.Entries().Where(e => e.State == EntityState.Modified || e.State == EntityState.Added);
            foreach (var modifiedEntity in l_modifiedEntities)
            {
                if (modifiedEntity is IDateTracking l_dateTrackedEntity)
                {
                    if (modifiedEntity.State == EntityState.Added)
                    {
                        l_dateTrackedEntity.DateCreated = DateTime.Now;
                    }
                    l_dateTrackedEntity.DateModified = DateTime.Now;
                }
            }
            try
            {
                return base.SaveChanges();
            }
            catch
            {
                return 0;
            }
        }
    }
}
