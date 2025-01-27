using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shared.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUsageLimitColumnInSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "usage_limit",
                table: "Subscriptions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "usage_limit",
                table: "Subscriptions",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
