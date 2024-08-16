using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace OutOfOffice.Server.Models.SQLmodels;
public partial class JwtTokens
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    [Required]
    public string Token { get; set; } = null!;
    [Required]
    public string Jti { get; set; } = null!;
    [Required]
    public int UserId { get; set; }
    [Required]
    public string Position { get; set; }
    [Required]
    public DateTime Expiration { get; set; }
    [Required]
    public bool Enabled { get; set; }

    ////Keys:

    //[ForeignKey("UserId")]
    //[JsonIgnore]
    //public Employee employeesToken { get; set; }
}

