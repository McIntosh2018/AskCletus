﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AskCletus_BackEnd.Services.DALModels
{
    public class Ingredients
    {
        [Key]
        public int IngredientsId { get; set; }
        public string Ingredient { get; set; }
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual AppUsers User { get; set; }
    }
}



//  bar id          ig              userid
//     1           beer              corn
//     2           wine              corn
//     3           whiskey           carson
//     4           beer              corn