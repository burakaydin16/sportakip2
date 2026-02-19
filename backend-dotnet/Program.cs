 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/backend-dotnet/Program.cs b/backend-dotnet/Program.cs
index 3df70d01f052db83d0ac97fd3d33ac997168ee2d..bd3d3ecc1e208a6860b7f63dc0fb9e7678ba92b2 100644
--- a/backend-dotnet/Program.cs
+++ b/backend-dotnet/Program.cs
@@ -1,38 +1,41 @@
 using Microsoft.EntityFrameworkCore;
 using PilatesApi.Data;
 
 var builder = WebApplication.CreateBuilder(args);
 
-// Add services to the container.
 builder.Services.AddControllers();
 builder.Services.AddEndpointsApiExplorer();
 builder.Services.AddSwaggerGen();
 
-// Configure PostgreSQL
-var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
+var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
+    ?? builder.Configuration.GetConnectionString("DefaultConnection");
+
+if (string.IsNullOrWhiteSpace(connectionString))
+{
+    throw new InvalidOperationException("PostgreSQL connection string is missing. Set ConnectionStrings__DefaultConnection.");
+}
+
 builder.Services.AddDbContext<AppDbContext>(options =>
     options.UseNpgsql(connectionString));
 
-// Enable CORS
 builder.Services.AddCors(options =>
 {
-    options.AddPolicy("AllowAll",
-        builder => builder.AllowAnyOrigin()
-                          .AllowAnyMethod()
-                          .AllowAnyHeader());
+    options.AddPolicy("AllowAll", policy => policy
+        .AllowAnyOrigin()
+        .AllowAnyMethod()
+        .AllowAnyHeader());
 });
 
 var app = builder.Build();
 
-// Configure the HTTP request pipeline.
 if (app.Environment.IsDevelopment())
 {
     app.UseSwagger();
     app.UseSwaggerUI();
 }
 
 app.UseCors("AllowAll");
 app.UseAuthorization();
 app.MapControllers();
 
 app.Run();
 
EOF
)