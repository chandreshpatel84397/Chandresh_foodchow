using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Domain.DTO;

namespace RepoPatternApi.Infrastructure.Repositories
{
    public class FoodDealRepository : IFoodDealRepository
    {
        private readonly string _connectionString;

        public FoodDealRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // ═══════════════════════════════════════════════════════
        // CREATE
        // ═══════════════════════════════════════════════════════
        public string CreateDeal(CreateFoodDealRequest model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlTransaction transaction = conn.BeginTransaction();
                try
                {
                    long newDealId = Convert.ToInt64(
                        new SqlCommand(
                            "SELECT ISNULL(MAX(deal_id),0)+1 FROM food_deals",
                            conn, transaction).ExecuteScalar());

                    SqlCommand cmd = new SqlCommand(@"
                        INSERT INTO food_deals
                        (deal_id, deal_name, deal_type_id, shop_id, deal_image,
                         deal_desc, deal_price, deal_MRP, total_deal_price, status,
                         percent_discount_on_cart, valid_order_method,
                         valid_payment_method, apply_discount, min_order, created_date)
                        VALUES
                        (@deal_id, @deal_name, @deal_type_id, @shop_id, @deal_image,
                         @deal_desc, @deal_price, @deal_MRP, @total_deal_price, @status,
                         @percent_discount_on_cart, @valid_order_method,
                         @valid_payment_method, @apply_discount, @min_order, @created_date)
                    ", conn, transaction);

                    cmd.Parameters.AddWithValue("@deal_id", newDealId);
                    cmd.Parameters.AddWithValue("@deal_name", model.DealName ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@deal_type_id", model.DealTypeId);
                    cmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                    cmd.Parameters.AddWithValue("@deal_image", string.IsNullOrEmpty(model.DealImage) ? (object)DBNull.Value : model.DealImage);
                    cmd.Parameters.AddWithValue("@deal_desc", model.DealDesc ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@deal_price", model.DealPrice);
                    cmd.Parameters.AddWithValue("@deal_MRP", model.DealMRP);
                    cmd.Parameters.AddWithValue("@total_deal_price", model.TotalDealPrice);
                    cmd.Parameters.AddWithValue("@status", model.Status);
                    cmd.Parameters.AddWithValue("@percent_discount_on_cart", model.PercentDiscountOnCart);
                    cmd.Parameters.AddWithValue("@valid_order_method", model.ValidOrderMethod ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@valid_payment_method", model.ValidPaymentMethod ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@apply_discount", model.ApplyDiscount);
                    cmd.Parameters.AddWithValue("@min_order", model.MinOrder);
                    cmd.Parameters.AddWithValue("@created_date", DateTime.Now);
                    cmd.ExecuteNonQuery();

                    // Insert tax
                    if (model.TaxIds != null && model.TaxIds.Count > 0)
                    {
                        foreach (var taxId in model.TaxIds)
                        {
                            SqlCommand taxCmd = new SqlCommand(@"
            INSERT INTO food_deals_tax (deal_id, shop_id, tax_id, tax_amount)
            VALUES (@deal_id, @shop_id, @tax_id, @tax_amount)
        ", conn, transaction);
                            taxCmd.Parameters.AddWithValue("@deal_id", newDealId);
                            taxCmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                            taxCmd.Parameters.AddWithValue("@tax_id", taxId);
                            taxCmd.Parameters.AddWithValue("@tax_amount", model.TaxAmount);
                            taxCmd.ExecuteNonQuery();
                        }
                    }

                    // Insert groups and items
                    if (model.DealGroups != null && model.DealGroups.Count > 0)
                    {
                        foreach (var group in model.DealGroups)
                        {
                            long newDealCategoryId = Convert.ToInt64(
                                new SqlCommand(
                                    "SELECT ISNULL(MAX(deal_category_id),0)+1 FROM food_deal_category",
                                    conn, transaction).ExecuteScalar());

                            SqlCommand catCmd = new SqlCommand(@"
                                INSERT INTO food_deal_category
                                (deal_category_id, deal_id, shop_id, group_no, category_id)
                                VALUES
                                (@deal_category_id, @deal_id, @shop_id, @group_no, @category_id)
                            ", conn, transaction);
                            catCmd.Parameters.AddWithValue("@deal_category_id", newDealCategoryId);
                            catCmd.Parameters.AddWithValue("@deal_id", newDealId);
                            catCmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                            catCmd.Parameters.AddWithValue("@group_no", group.GroupNo);
                            catCmd.Parameters.AddWithValue("@category_id",
                                group.Items != null && group.Items.Count > 0
                                    ? (object)group.Items[0].CategoryId : DBNull.Value);
                            catCmd.ExecuteNonQuery();

                            if (group.Items != null)
                            {
                                foreach (var item in group.Items)
                                {
                                    long newDealItemId = Convert.ToInt64(
                                        new SqlCommand(
                                            "SELECT ISNULL(MAX(deal_item_id),0)+1 FROM food_deal_item",
                                            conn, transaction).ExecuteScalar());

                                    SqlCommand itemCmd = new SqlCommand(@"
                                        INSERT INTO food_deal_item
                                        (deal_item_id, deal_category_id, category_id, item_id)
                                        VALUES
                                        (@deal_item_id, @deal_category_id, @category_id, @item_id)
                                    ", conn, transaction);
                                    itemCmd.Parameters.AddWithValue("@deal_item_id", newDealItemId);
                                    itemCmd.Parameters.AddWithValue("@deal_category_id", newDealCategoryId);
                                    itemCmd.Parameters.AddWithValue("@category_id", item.CategoryId);
                                    itemCmd.Parameters.AddWithValue("@item_id", item.ItemId);
                                    itemCmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }

                    transaction.Commit();
                    return "Deal Created Successfully";
                }
                catch { transaction.Rollback(); throw; }
            }
        }

        // ═══════════════════════════════════════════════════════
        // UPDATE
        // ═══════════════════════════════════════════════════════
        public string UpdateDeal(long dealId, CreateFoodDealRequest model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlTransaction transaction = conn.BeginTransaction();
                try
                {
                    // Update food_deals
                    SqlCommand cmd = new SqlCommand(@"
                        UPDATE food_deals SET
                            deal_name                = @deal_name,
                            deal_type_id             = @deal_type_id,
                            shop_id                  = @shop_id,
                            deal_image               = @deal_image,
                            deal_desc                = @deal_desc,
                            deal_price               = @deal_price,
                            deal_MRP                 = @deal_MRP,
                            total_deal_price         = @total_deal_price,
                            status                   = @status,
                            percent_discount_on_cart = @percent_discount_on_cart,
                            valid_order_method       = @valid_order_method,
                            valid_payment_method     = @valid_payment_method,
                            apply_discount           = @apply_discount,
                            min_order                = @min_order,
                            updated_date             = @updated_date
                        WHERE deal_id = @deal_id
                    ", conn, transaction);

                    cmd.Parameters.AddWithValue("@deal_id", dealId);
                    cmd.Parameters.AddWithValue("@deal_name", model.DealName ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@deal_type_id", model.DealTypeId);
                    cmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                    cmd.Parameters.AddWithValue("@deal_image", string.IsNullOrEmpty(model.DealImage) ? (object)DBNull.Value : model.DealImage);
                    cmd.Parameters.AddWithValue("@deal_desc", model.DealDesc ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@deal_price", model.DealPrice);
                    cmd.Parameters.AddWithValue("@deal_MRP", model.DealMRP);
                    cmd.Parameters.AddWithValue("@total_deal_price", model.TotalDealPrice);
                    cmd.Parameters.AddWithValue("@status", model.Status);
                    cmd.Parameters.AddWithValue("@percent_discount_on_cart", model.PercentDiscountOnCart);
                    cmd.Parameters.AddWithValue("@valid_order_method", model.ValidOrderMethod ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@valid_payment_method", model.ValidPaymentMethod ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@apply_discount", model.ApplyDiscount);
                    cmd.Parameters.AddWithValue("@min_order", model.MinOrder);
                    cmd.Parameters.AddWithValue("@updated_date", DateTime.Now);
                    cmd.ExecuteNonQuery();

                    // Delete old tax then insert new
                    SqlCommand deleteTaxCmd = new SqlCommand(@"
    DELETE FROM food_deals_tax WHERE deal_id = @deal_id
", conn, transaction);
                    deleteTaxCmd.Parameters.AddWithValue("@deal_id", dealId);
                    deleteTaxCmd.ExecuteNonQuery();

                    if (model.TaxIds != null && model.TaxIds.Count > 0)
                    {
                        foreach (var taxId in model.TaxIds)
                        {
                            SqlCommand taxCmd = new SqlCommand(@"
            INSERT INTO food_deals_tax (deal_id, shop_id, tax_id, tax_amount)
            VALUES (@deal_id, @shop_id, @tax_id, @tax_amount)
        ", conn, transaction);
                            taxCmd.Parameters.AddWithValue("@deal_id", dealId);
                            taxCmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                            taxCmd.Parameters.AddWithValue("@tax_id", taxId);
                            taxCmd.Parameters.AddWithValue("@tax_amount", model.TaxAmount);
                            taxCmd.ExecuteNonQuery();
                        }
                    }
                    // Get old category ids
                    SqlCommand getCatIds = new SqlCommand(
                        "SELECT deal_category_id FROM food_deal_category WHERE deal_id = @deal_id",
                        conn, transaction);
                    getCatIds.Parameters.AddWithValue("@deal_id", dealId);
                    List<long> catIds = new List<long>();
                    using (SqlDataReader r = getCatIds.ExecuteReader())
                    {
                        while (r.Read())
                            catIds.Add(Convert.ToInt64(r["deal_category_id"]));
                    }

                    // Delete old items
                    foreach (long catId in catIds)
                    {
                        SqlCommand delItems = new SqlCommand(
                            "DELETE FROM food_deal_item WHERE deal_category_id = @cid",
                            conn, transaction);
                        delItems.Parameters.AddWithValue("@cid", catId);
                        delItems.ExecuteNonQuery();
                    }

                    // Delete old categories
                    SqlCommand delCats = new SqlCommand(
                        "DELETE FROM food_deal_category WHERE deal_id = @deal_id",
                        conn, transaction);
                    delCats.Parameters.AddWithValue("@deal_id", dealId);
                    delCats.ExecuteNonQuery();

                    // Re-insert groups and items
                    if (model.DealGroups != null && model.DealGroups.Count > 0)
                    {
                        foreach (var group in model.DealGroups)
                        {
                            long newDealCategoryId = Convert.ToInt64(
                                new SqlCommand(
                                    "SELECT ISNULL(MAX(deal_category_id),0)+1 FROM food_deal_category",
                                    conn, transaction).ExecuteScalar());

                            SqlCommand catCmd = new SqlCommand(@"
                                INSERT INTO food_deal_category
                                (deal_category_id, deal_id, shop_id, group_no, category_id)
                                VALUES
                                (@deal_category_id, @deal_id, @shop_id, @group_no, @category_id)
                            ", conn, transaction);
                            catCmd.Parameters.AddWithValue("@deal_category_id", newDealCategoryId);
                            catCmd.Parameters.AddWithValue("@deal_id", dealId);
                            catCmd.Parameters.AddWithValue("@shop_id", model.ShopId);
                            catCmd.Parameters.AddWithValue("@group_no", group.GroupNo);
                            catCmd.Parameters.AddWithValue("@category_id",
                                group.Items != null && group.Items.Count > 0
                                    ? (object)group.Items[0].CategoryId : DBNull.Value);
                            catCmd.ExecuteNonQuery();

                            if (group.Items != null)
                            {
                                foreach (var item in group.Items)
                                {
                                    long newDealItemId = Convert.ToInt64(
                                        new SqlCommand(
                                            "SELECT ISNULL(MAX(deal_item_id),0)+1 FROM food_deal_item",
                                            conn, transaction).ExecuteScalar());

                                    SqlCommand itemCmd = new SqlCommand(@"
                                        INSERT INTO food_deal_item
                                        (deal_item_id, deal_category_id, category_id, item_id)
                                        VALUES
                                        (@deal_item_id, @deal_category_id, @category_id, @item_id)
                                    ", conn, transaction);
                                    itemCmd.Parameters.AddWithValue("@deal_item_id", newDealItemId);
                                    itemCmd.Parameters.AddWithValue("@deal_category_id", newDealCategoryId);
                                    itemCmd.Parameters.AddWithValue("@category_id", item.CategoryId);
                                    itemCmd.Parameters.AddWithValue("@item_id", item.ItemId);
                                    itemCmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }

                    transaction.Commit();
                    return "Deal Updated Successfully";
                }
                catch { transaction.Rollback(); throw; }
            }
        }

        // ═══════════════════════════════════════════════════════
        // DELETE
        // ═══════════════════════════════════════════════════════
        public string DeleteDeal(long dealId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlTransaction transaction = conn.BeginTransaction();
                try
                {
                    SqlCommand getCatIds = new SqlCommand(
                        "SELECT deal_category_id FROM food_deal_category WHERE deal_id = @deal_id",
                        conn, transaction);
                    getCatIds.Parameters.AddWithValue("@deal_id", dealId);
                    List<long> catIds = new List<long>();
                    using (SqlDataReader r = getCatIds.ExecuteReader())
                    {
                        while (r.Read())
                            catIds.Add(Convert.ToInt64(r["deal_category_id"]));
                    }

                    foreach (long catId in catIds)
                    {
                        SqlCommand delItems = new SqlCommand(
                            "DELETE FROM food_deal_item WHERE deal_category_id = @cid",
                            conn, transaction);
                        delItems.Parameters.AddWithValue("@cid", catId);
                        delItems.ExecuteNonQuery();
                    }

                    SqlCommand delCats = new SqlCommand(
                        "DELETE FROM food_deal_category WHERE deal_id = @deal_id",
                        conn, transaction);
                    delCats.Parameters.AddWithValue("@deal_id", dealId);
                    delCats.ExecuteNonQuery();

                    SqlCommand delTax = new SqlCommand(
                        "DELETE FROM food_deals_tax WHERE deal_id = @deal_id",
                        conn, transaction);
                    delTax.Parameters.AddWithValue("@deal_id", dealId);
                    delTax.ExecuteNonQuery();

                    SqlCommand delDeal = new SqlCommand(
                        "DELETE FROM food_deals WHERE deal_id = @deal_id",
                        conn, transaction);
                    delDeal.Parameters.AddWithValue("@deal_id", dealId);
                    delDeal.ExecuteNonQuery();

                    transaction.Commit();
                    return "Deal Deleted Successfully";
                }
                catch { transaction.Rollback(); throw; }
            }
        }

        // ═══════════════════════════════════════════════════════
        // GET ALL
        // ═══════════════════════════════════════════════════════
        public List<CreateFoodDealRequest> GetAllDeals()
        {
            var list = new List<CreateFoodDealRequest>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM food_deals", conn);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new CreateFoodDealRequest
                        {
                            DealId = reader["deal_id"] == DBNull.Value ? 0 : Convert.ToInt64(reader["deal_id"]),
                            DealName = reader["deal_name"] == DBNull.Value ? "" : reader["deal_name"].ToString(),
                            DealTypeId = reader["deal_type_id"] == DBNull.Value ? 0 : Convert.ToInt64(reader["deal_type_id"]),
                            ShopId = reader["shop_id"] == DBNull.Value ? 0 : Convert.ToInt64(reader["shop_id"]),
                            DealImage = reader["deal_image"] == DBNull.Value ? null : reader["deal_image"].ToString(),
                            DealDesc = reader["deal_desc"] == DBNull.Value ? "" : reader["deal_desc"].ToString(),
                            DealPrice = reader["deal_price"] == DBNull.Value ? 0 : Convert.ToDouble(reader["deal_price"]),
                            DealMRP = reader["deal_MRP"] == DBNull.Value ? 0 : Convert.ToDouble(reader["deal_MRP"]),
                            TotalDealPrice = reader["total_deal_price"] == DBNull.Value ? 0 : Convert.ToDouble(reader["total_deal_price"]),
                            Status = reader["status"] == DBNull.Value ? 0 : Convert.ToInt64(reader["status"]),
                            PercentDiscountOnCart = reader["percent_discount_on_cart"] == DBNull.Value ? 0 : Convert.ToDouble(reader["percent_discount_on_cart"]),
                            ValidOrderMethod = reader["valid_order_method"] == DBNull.Value ? "" : reader["valid_order_method"].ToString(),
                            ValidPaymentMethod = reader["valid_payment_method"] == DBNull.Value ? "" : reader["valid_payment_method"].ToString(),
                            ApplyDiscount = reader["apply_discount"] == DBNull.Value ? 0 : Convert.ToInt64(reader["apply_discount"]),
                            MinOrder = reader["min_order"] == DBNull.Value ? 0 : Convert.ToInt64(reader["min_order"])
                        });
                    }
                }
            }
            return list;
        }

        // ═══════════════════════════════════════════════════════
        // GET BY ID
        // ═══════════════════════════════════════════════════════
        public CreateFoodDealRequest GetDealById(long dealId)
        {
            var deal = new CreateFoodDealRequest();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(
                    "SELECT * FROM food_deals WHERE deal_id = @deal_id", conn);
                cmd.Parameters.AddWithValue("@deal_id", dealId);
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        deal.DealId = reader["deal_id"] == DBNull.Value ? 0 : Convert.ToInt64(reader["deal_id"]);
                        deal.DealName = reader["deal_name"] == DBNull.Value ? "" : reader["deal_name"].ToString();
                        deal.DealTypeId = reader["deal_type_id"] == DBNull.Value ? 0 : Convert.ToInt64(reader["deal_type_id"]);
                        deal.ShopId = reader["shop_id"] == DBNull.Value ? 0 : Convert.ToInt64(reader["shop_id"]);
                        deal.DealImage = reader["deal_image"] == DBNull.Value ? null : reader["deal_image"].ToString();
                        deal.DealDesc = reader["deal_desc"] == DBNull.Value ? "" : reader["deal_desc"].ToString();
                        deal.DealPrice = reader["deal_price"] == DBNull.Value ? 0 : Convert.ToDouble(reader["deal_price"]);
                        deal.DealMRP = reader["deal_MRP"] == DBNull.Value ? 0 : Convert.ToDouble(reader["deal_MRP"]);
                        deal.TotalDealPrice = reader["total_deal_price"] == DBNull.Value ? 0 : Convert.ToDouble(reader["total_deal_price"]);
                        deal.Status = reader["status"] == DBNull.Value ? 0 : Convert.ToInt64(reader["status"]);
                        deal.PercentDiscountOnCart = reader["percent_discount_on_cart"] == DBNull.Value ? 0 : Convert.ToDouble(reader["percent_discount_on_cart"]);
                        deal.ValidOrderMethod = reader["valid_order_method"] == DBNull.Value ? "" : reader["valid_order_method"].ToString();
                        deal.ValidPaymentMethod = reader["valid_payment_method"] == DBNull.Value ? "" : reader["valid_payment_method"].ToString();
                        deal.ApplyDiscount = reader["apply_discount"] == DBNull.Value ? 0 : Convert.ToInt64(reader["apply_discount"]);
                        deal.MinOrder = reader["min_order"] == DBNull.Value ? 0 : Convert.ToInt64(reader["min_order"]);
                    }
                }
            }
            return deal;
        }

        // ═══════════════════════════════════════════════════════
        // UPDATE IMAGE
        // ═══════════════════════════════════════════════════════
        public string UpdateDealImage(long dealId, string dealImage)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
                    UPDATE food_deals
                    SET deal_image = @deal_image, updated_date = @updated_date
                    WHERE deal_id = @deal_id
                ", conn);
                cmd.Parameters.AddWithValue("@deal_id", dealId);
                cmd.Parameters.AddWithValue("@deal_image", string.IsNullOrEmpty(dealImage) ? (object)DBNull.Value : dealImage);
                cmd.Parameters.AddWithValue("@updated_date", DateTime.Now);
                cmd.ExecuteNonQuery();
                return "Deal Image Updated Successfully";
            }
        }

        // ═══════════════════════════════════════════════════════
        // UPDATE STATUS
        // ═══════════════════════════════════════════════════════
        public string UpdateDealStatus(long dealId, long status)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
                    UPDATE food_deals
                    SET status = @status, updated_date = @updated_date
                    WHERE deal_id = @deal_id
                ", conn);
                cmd.Parameters.AddWithValue("@deal_id", dealId);
                cmd.Parameters.AddWithValue("@status", status);
                cmd.Parameters.AddWithValue("@updated_date", DateTime.Now);
                int rows = cmd.ExecuteNonQuery();
                return rows > 0 ? "Deal status updated successfully" : "Deal not found";
            }
        }

        // ═══════════════════════════════════════════════════════
        // GET DEAL TAX
        // ═══════════════════════════════════════════════════════
        public List<object> GetDealTaxes(long dealId)
        {
            var result = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(@"
            SELECT tax_id, tax_amount 
            FROM food_deals_tax 
            WHERE deal_id = @deal_id
        ", conn);
                cmd.Parameters.AddWithValue("@deal_id", dealId);
                using (SqlDataReader r = cmd.ExecuteReader())
                {
                    while (r.Read())
                    {
                        result.Add(new
                        {
                            taxId = Convert.ToInt64(r["tax_id"]),
                            taxAmount = Convert.ToDouble(r["tax_amount"])
                        });
                    }
                }
            }
            return result;
        }

        // ═══════════════════════════════════════════════════════
        // GET DEAL GROUPS
        // ═══════════════════════════════════════════════════════
        public List<object> GetDealGroups(long dealId)
        {
            var result = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // Get all groups for this deal
                SqlCommand catCmd = new SqlCommand(@"
            SELECT deal_category_id, group_no
            FROM food_deal_category
            WHERE deal_id = @deal_id
            ORDER BY group_no
        ", conn);
                catCmd.Parameters.AddWithValue("@deal_id", dealId);

                var groups = new List<(long dealCategoryId, int groupNo)>();
                using (SqlDataReader r = catCmd.ExecuteReader())
                {
                    while (r.Read())
                    {
                        groups.Add((
                            Convert.ToInt64(r["deal_category_id"]),
                            Convert.ToInt32(r["group_no"])
                        ));
                    }
                }

                // Get items for each group
                foreach (var group in groups)
                {
                    SqlCommand itemCmd = new SqlCommand(@"
    SELECT 
        fdi.item_id,
        fdi.category_id,
        fc.cate_name AS categoryName,
        fi.item_name
    FROM food_deal_item fdi
    JOIN food_category fc ON fdi.category_id = fc.id
    JOIN food_item fi ON fdi.item_id = fi.item_id    -- ✅ fi.item_id is correct
    WHERE fdi.deal_category_id = @deal_category_id
", conn);

                    // ✅ Parameter matches @deal_category_id in query
                    itemCmd.Parameters.AddWithValue("@deal_category_id", group.dealCategoryId);

                    var items = new List<object>();
                    using (SqlDataReader r = itemCmd.ExecuteReader())
                    {
                        while (r.Read())
                        {
                            items.Add(new
                            {
                                itemId = r["item_id"] == DBNull.Value ? 0 : Convert.ToInt64(r["item_id"]),
                                categoryId = r["category_id"] == DBNull.Value ? 0 : Convert.ToInt64(r["category_id"]),
                                itemName = r["item_name"] == DBNull.Value ? "" : r["item_name"].ToString(),
                                categoryName = r["categoryName"] == DBNull.Value ? "" : r["categoryName"].ToString() // ✅ matches alias
                            });
                        }
                    }

                    result.Add(new { groupNo = group.groupNo, items });
                }
            }
            return result;
        }
    }
}