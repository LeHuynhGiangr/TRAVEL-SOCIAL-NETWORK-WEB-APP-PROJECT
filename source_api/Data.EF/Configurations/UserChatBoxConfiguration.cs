using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.EF.Configurations
{
    public class UserChatBoxConfiguration : IEntityTypeConfiguration<UserChatBox>
    {
        public void Configure(EntityTypeBuilder<UserChatBox> builder)
        {
            builder.ToTable("userchatboxes");

            builder.HasOne(uc => uc.User).WithMany(u => u.UserChatBoxes)
                .HasForeignKey(uc => uc.UserId)
                .HasConstraintName("fk_userchatbox_user_userid")
                .OnDelete(deleteBehavior: DeleteBehavior.Cascade);

            builder.HasOne(uc => uc.ChatBox).WithMany(u => u.UserChatBoxes)
                .HasForeignKey(uc => uc.ChatBoxId)
                .HasConstraintName("fk_userchatbox_chatbox_chatboxid")
                .OnDelete(deleteBehavior: DeleteBehavior.Cascade);

            builder.HasIndex(p => new { p.UserId, p.ChatBoxId }).IsUnique();

            builder.HasKey(p => p.Id);
        }
    }
}
