using Microsoft.EntityFrameworkCore;
using Data.Entities;

namespace Data.EF.Configurations
{
    public class ChatBoxConfiguration : IEntityTypeConfiguration<ChatBox>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<ChatBox> builder)
        {
            builder.ToTable("chatboxes");
        }
    }
}
