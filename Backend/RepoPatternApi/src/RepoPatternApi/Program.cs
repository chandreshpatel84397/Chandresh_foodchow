using Microsoft.AspNetCore.Http.Features;
using Microsoft.Data.SqlClient;
using OfficeOpenXml;
using RepoPatternApi.Application.Interfaces;
using RepoPatternApi.Application.Services;
using RepoPatternApi.Infrastructure.Data;
using RepoPatternApi.Infrastructure.Extensions;
using RepoPatternApi.Infrastructure.Repositories;
using System.Data;
using OfficeOpenXml;


var builder = WebApplication.CreateBuilder(args);


// Add services

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();


// existing DI

builder.Services.AddScoped<IFoodItemCustomCategoryRepository,
FoodItemCustomCategoryService>();

builder.Services.AddScoped<MyProfileService>();

builder.Services.AddScoped<IMyProfileRepository,
MyProfileRepository>();

builder.Services.AddScoped<IMenuLanguageRepository,
MenuLanguageRepository>();

builder.Services.AddScoped<IMenuLanguageService,
MenuLanguageService>();

builder.Services.AddScoped<IFoodItemRepository, FoodItemRepository>();
builder.Services.AddScoped<FoodItemService>();
// Extras API (food_item_ingredients)

builder.Services.AddScoped<IFoodItemIngredientRepository,
FoodItemIngredientRepository>();

builder.Services.AddScoped<FoodItemIngredientService>();




// category mapper

builder.Services.AddScoped<ICategoryMapperRepository,
CategoryMapperRepository>();


// food deals

builder.Services.AddScoped<IFoodDealRepository,
FoodDealRepository>();

builder.Services.AddScoped<FoodDealService>();


// food deal type

builder.Services.AddScoped<IFoodDealTypeRepository,
FoodDealTypeRepository>();

builder.Services.AddScoped<FoodDealTypeService>();


// food menu

builder.Services.AddScoped<IFoodMenuRepository,
FoodMenuRepository>();

builder.Services.AddScoped<FoodMenuService>();


// service extension

builder.Services.AddInfrastructure(builder.Configuration);


// food category

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10 MB
});

// extra service
builder.Services.AddScoped<IIngredientRepository, IngredientRepository>();

builder.Services.AddScoped<IIngredientService, IngredientService>();


// stored procedure executor

DbStoredProcedureExecutor.Configure(

builder.Configuration.GetConnectionString("DefaultConnection")

);


// IMPORTANT FIX ?

builder.Services.AddScoped<IDbConnection>(x =>

new SqlConnection(

builder.Configuration.GetConnectionString("DefaultConnection")

));


// CORS

builder.Services.AddCors(option =>

{

    option.AddPolicy("AllowNextJs",

        policy =>

        {

            policy.WithOrigins("http://localhost:3000")

            .AllowAnyHeader()

            .AllowAnyMethod();

        });

});


// food preference

builder.Services.AddScoped<IFoodPreferenceRepository,
FoodPreferenceRepository>();

builder.Services.AddScoped<FoodPreferenceService>();

// FoodShopTax
builder.Services.AddScoped<IFoodShopTaxRepository, FoodShopTaxRepository>();
builder.Services.AddScoped<IFoodShopTaxService, FoodShopTaxService>();

// FoodApplyTax
builder.Services.AddScoped<IFoodApplyTaxRepository, FoodApplyTaxRepository>();
builder.Services.AddScoped<IFoodApplyTaxService, FoodApplyTaxService>();
var app = builder.Build();

app.UseCors("AllowNextJs");


if (app.Environment.IsDevelopment())
{

    app.UseSwagger();

    app.UseSwaggerUI();

}


// category
app.UseStaticFiles();


// menu upload

ExcelPackage.License.SetNonCommercialPersonal("Meet Patel");





app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        @"C:\Users\admin\Pictures\Screenshots"
    ),
    RequestPath = "/images"
});

app.UseAuthorization();

app.MapControllers();

app.Run();