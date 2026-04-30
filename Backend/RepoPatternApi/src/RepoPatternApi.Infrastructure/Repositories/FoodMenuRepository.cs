using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodMenuRepository : IFoodMenuRepository
    {
        private readonly string _connectionString;

        public FoodMenuRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // ================= MENU =================

        // Insert new menu
        public long InsertMenu(ShopMenuDto model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                long newId = Convert.ToInt64(
                    new SqlCommand("SELECT ISNULL(MAX(id),0)+1 FROM food_shop_menu", conn)
                    .ExecuteScalar());

                SqlCommand cmd = new SqlCommand(@"
                    INSERT INTO food_shop_menu
                    (id, shop_id, menu_name, description, start_time, end_time,
                     status, created_date, for_online, for_pos)
                    VALUES
                    (@id, @shop_id, @menu_name, @description,
                     @start_time, @end_time, @status, @created_date,
                     @for_online, @for_pos)", conn);

                cmd.Parameters.AddWithValue("@id", newId);
                cmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                cmd.Parameters.AddWithValue("@menu_name", model.MenuName);
                cmd.Parameters.AddWithValue("@description", model.Description);
                cmd.Parameters.AddWithValue("@start_time", model.StartTime);
                cmd.Parameters.AddWithValue("@end_time", model.EndTime);
                cmd.Parameters.AddWithValue("@status", model.Status);
                cmd.Parameters.AddWithValue("@for_online", model.ForOnline);
                cmd.Parameters.AddWithValue("@for_pos", model.ForPos);
                cmd.Parameters.AddWithValue("@created_date", DateTime.Now);

                cmd.ExecuteNonQuery();

                return newId; // ✅ FIX
            }
        }
        // Get All Menus
        public List<ShopMenuDto> GetAllMenus()
        {
            List<ShopMenuDto> list = new List<ShopMenuDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM food_shop_menu", conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    list.Add(new ShopMenuDto
                    {
                        Id = Convert.ToInt64(reader["id"]),

                        ShopId = Convert.ToInt64(reader["shop_id"]),
                        MenuName = reader["menu_name"].ToString(),
                        Description = reader["description"].ToString(),
                        StartTime = reader["start_time"].ToString(),
                        EndTime = reader["end_time"].ToString(),
                        Status = Convert.ToInt64(reader["status"]),
                        ForOnline = Convert.ToInt64(reader["for_online"]),
                        ForPos = Convert.ToInt64(reader["for_pos"])
                    });
                }
            }
            return list;
        }

        // Get Menu By Id

        public ShopMenuDto GetMenuById(long id)
        {
            ShopMenuDto menu = new ShopMenuDto();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM food_shop_menu WHERE id=@id", conn);

                cmd.Parameters.AddWithValue("@id", id);

                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    menu.Id = Convert.ToInt64(reader["id"]); // ✅ FIX
                    menu.ShopId = Convert.ToInt64(reader["shop_id"]);
                    menu.MenuName = reader["menu_name"].ToString();
                    menu.Description = reader["description"].ToString();
                    menu.StartTime = reader["start_time"].ToString();
                    menu.EndTime = reader["end_time"].ToString();
                    menu.Status = Convert.ToInt64(reader["status"]);
                    menu.ForOnline = Convert.ToInt64(reader["for_online"]);
                    menu.ForPos = Convert.ToInt64(reader["for_pos"]);
                }
            }

            return menu;
        }

        // update menu 

        public string UpdateMenu(long id, ShopMenuDto model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(@"
                    UPDATE food_shop_menu SET
                        menu_name=@menu_name,
                        description=@description,
                        start_time=@start_time,
                        end_time=@end_time,
                        status=@status,
                        for_online=@for_online,
                        for_pos=@for_pos,
                        updated_date=@updated_date
                    WHERE id=@id", conn);

                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@menu_name", model.MenuName);
                cmd.Parameters.AddWithValue("@description", model.Description);
                cmd.Parameters.AddWithValue("@start_time", model.StartTime);
                cmd.Parameters.AddWithValue("@end_time", model.EndTime);
                cmd.Parameters.AddWithValue("@status", model.Status);
                cmd.Parameters.AddWithValue("@for_online", model.ForOnline);
                cmd.Parameters.AddWithValue("@for_pos", model.ForPos);
                cmd.Parameters.AddWithValue("@updated_date", DateTime.Now);

                cmd.ExecuteNonQuery();

                return "Updated";
            }
        }
        // Delete Menu
        public string DeleteMenu(long id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1️⃣ Delete timings first
                SqlCommand cmd1 = new SqlCommand(
                    "DELETE FROM food_menu_timings WHERE menu_id=@id", conn);
                cmd1.Parameters.AddWithValue("@id", id);
                cmd1.ExecuteNonQuery();

                // 2️⃣ Delete items
                SqlCommand cmd2 = new SqlCommand(
                    "DELETE FROM food_shop_menu_items WHERE menu_id=@id", conn);
                cmd2.Parameters.AddWithValue("@id", id);
                cmd2.ExecuteNonQuery();

                // 3️⃣ Delete main menu
                SqlCommand cmd3 = new SqlCommand(
                    "DELETE FROM food_shop_menu WHERE id=@id", conn);
                cmd3.Parameters.AddWithValue("@id", id);
                cmd3.ExecuteNonQuery();

                return "Deleted Successfully";
            }
        }

        // ================= MENU TIMINGS =================

        public string InsertMenuTimings(List<MenuTimingDto> timings)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                foreach (var t in timings)
                {
                    long newId = Convert.ToInt64(
                        new SqlCommand("SELECT ISNULL(MAX(id),0)+1 FROM food_menu_timings", conn)
                        .ExecuteScalar());

                    SqlCommand cmd = new SqlCommand(@"
                        INSERT INTO food_menu_timings
                        (id, shop_id, menu_id, days_name, open_time,
                         close_time, close_day, full_day, created_date)
                        VALUES
                        (@id, @shop_id, @menu_id, @days_name,
                         @open_time, @close_time, @close_day,
                         @full_day, @created_date)", conn);

                    cmd.Parameters.AddWithValue("@id", newId);
                    cmd.Parameters.AddWithValue("@shop_id", t.ShopId);
                    cmd.Parameters.AddWithValue("@menu_id", t.MenuId);
                    cmd.Parameters.AddWithValue("@days_name", t.DaysName);
                    cmd.Parameters.AddWithValue("@open_time", t.OpenTime);
                    cmd.Parameters.AddWithValue("@close_time", t.CloseTime);
                    cmd.Parameters.AddWithValue("@close_day", t.CloseDay);
                    cmd.Parameters.AddWithValue("@full_day", t.FullDay);
                    cmd.Parameters.AddWithValue("@created_date", DateTime.Now);

                    cmd.ExecuteNonQuery();
                }

                return "Menu Timings Inserted";
            }
        }
        // update menu timimngs 

        public string UpdateMenuTimings(long menuId, List<MenuTimingDto> timings)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // STEP 1: Delete old timings of this menu
                SqlCommand deleteCmd = new SqlCommand(
                    "DELETE FROM food_menu_timings WHERE menu_id = @menu_id", conn);

                deleteCmd.Parameters.AddWithValue("@menu_id", menuId);
                deleteCmd.ExecuteNonQuery();

                // STEP 2: Insert all updated 7 days again
                foreach (var t in timings)
                {
                    long newId = Convert.ToInt64(
                        new SqlCommand("SELECT ISNULL(MAX(id),0)+1 FROM food_menu_timings", conn)
                        .ExecuteScalar());

                    SqlCommand cmd = new SqlCommand(@"
                INSERT INTO food_menu_timings
                (id, shop_id, menu_id, days_name, open_time,
                 close_time, close_day, full_day, created_date)
                VALUES
                (@id, @shop_id, @menu_id, @days_name,
                 @open_time, @close_time, @close_day,
                 @full_day, @created_date)", conn);

                    cmd.Parameters.AddWithValue("@id", newId);
                    cmd.Parameters.AddWithValue("@shop_id", t.ShopId);
                    cmd.Parameters.AddWithValue("@menu_id", menuId);
                    cmd.Parameters.AddWithValue("@days_name", t.DaysName);
                    cmd.Parameters.AddWithValue("@open_time", t.OpenTime);
                    cmd.Parameters.AddWithValue("@close_time", t.CloseTime);
                    cmd.Parameters.AddWithValue("@close_day", t.CloseDay);
                    cmd.Parameters.AddWithValue("@full_day", t.FullDay);
                    cmd.Parameters.AddWithValue("@created_date", DateTime.Now);

                    cmd.ExecuteNonQuery();
                }

                return "Menu Timings Updated Successfully";
            }
        }
        public List<MenuTimingDto> GetMenuTimings(long menuId)
        {
            List<MenuTimingDto> list = new List<MenuTimingDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM food_menu_timings WHERE menu_id=@menu_id", conn);

                cmd.Parameters.AddWithValue("@menu_id", menuId);

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    list.Add(new MenuTimingDto
                    {
                        MenuId = Convert.ToInt64(reader["menu_id"]),
                        DaysName = reader["days_name"].ToString(),
                        OpenTime = reader["open_time"].ToString(),
                        CloseTime = reader["close_time"].ToString(),
                        CloseDay = Convert.ToInt64(reader["close_day"]),
                        FullDay = Convert.ToInt64(reader["full_day"])
                    });
                }
            }

            return list;
        }

        public string DeleteMenuTimings(long menuId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                new SqlCommand("DELETE FROM food_menu_timings WHERE menu_id=@menu_id", conn)
                {
                    Parameters = { new SqlParameter("@menu_id", menuId) }
                }.ExecuteNonQuery();

                return "Menu Timings Deleted";
            }
        }

        // ================= MENU ITEMS =================

        public string InsertMenuItems(List<MenuItemDto> items)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                foreach (var i in items)
                {
                    long newId = Convert.ToInt64(
                        new SqlCommand("SELECT ISNULL(MAX(id),0)+1 FROM food_shop_menu_items", conn)
                        .ExecuteScalar());

                    SqlCommand cmd = new SqlCommand(@"
                        INSERT INTO food_shop_menu_items
                        (id, shop_id, menu_id, category_id, item_id,
                         size_id, price, total_price, created_date)
                        VALUES
                        (@id, @shop_id, @menu_id, @category_id,
                         @item_id, @size_id, @price,
                         @total_price, @created_date)", conn);

                    cmd.Parameters.AddWithValue("@id", newId);
                    cmd.Parameters.AddWithValue("@shop_id", i.ShopId);
                    cmd.Parameters.AddWithValue("@menu_id", i.MenuId);
                    cmd.Parameters.AddWithValue("@category_id", i.CategoryId);
                    cmd.Parameters.AddWithValue("@item_id", i.ItemId);
                    cmd.Parameters.AddWithValue("@size_id", i.SizeId);
                    cmd.Parameters.AddWithValue("@price", i.Price);
                    cmd.Parameters.AddWithValue("@total_price", i.TotalPrice);
                    cmd.Parameters.AddWithValue("@created_date", DateTime.Now);

                    cmd.ExecuteNonQuery();
                }

                return "Menu Items Inserted";
            }
        }

        // update menu items  

        public string UpdateMenuItems(long menuId, List<MenuItemDto> items) // ✅ FIX
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                new SqlCommand("DELETE FROM food_shop_menu_items WHERE menu_id=@menu_id", conn)
                {
                    Parameters = { new SqlParameter("@menu_id", menuId) }
                }.ExecuteNonQuery();

                foreach (var i in items)
                {
                    long newId = Convert.ToInt64(
                        new SqlCommand("SELECT ISNULL(MAX(id),0)+1 FROM food_shop_menu_items", conn)
                        .ExecuteScalar());

                    SqlCommand cmd = new SqlCommand(@"
                        INSERT INTO food_shop_menu_items
                        (id, shop_id, menu_id, category_id, item_id)
                        VALUES (@id, @shop_id, @menu_id, @category_id, @item_id)", conn);

                    cmd.Parameters.AddWithValue("@id", newId);
                    cmd.Parameters.AddWithValue("@shop_id", i.ShopId);
                    cmd.Parameters.AddWithValue("@menu_id", menuId); // ✅ FIX
                    cmd.Parameters.AddWithValue("@category_id", i.CategoryId);
                    cmd.Parameters.AddWithValue("@item_id", i.ItemId);

                    cmd.ExecuteNonQuery();
                }

                return "Updated";
            }
        }


        public List<MenuItemDto> GetMenuItems(long menuId) // ✅ FIX
        {
            List<MenuItemDto> list = new List<MenuItemDto>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM food_shop_menu_items WHERE menu_id=@menu_id", conn);

                cmd.Parameters.AddWithValue("@menu_id", menuId);

                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    list.Add(new MenuItemDto
                    {
                        MenuId = Convert.ToInt64(reader["menu_id"]),
                        CategoryId = Convert.ToInt64(reader["category_id"]),
                        ItemId = Convert.ToInt64(reader["item_id"])
                    });
                }
            }

            return list;
        }


        public string DeleteMenuItems(long menuId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(
                    "DELETE FROM food_shop_menu_items WHERE menu_id=@menu_id", conn);

                cmd.Parameters.AddWithValue("@menu_id", menuId);

                cmd.ExecuteNonQuery();

                return "Deleted";
            }
        }
    }
}               