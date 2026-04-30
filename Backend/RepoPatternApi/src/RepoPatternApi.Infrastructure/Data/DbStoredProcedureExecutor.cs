using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Reflection;


namespace RepoPatternApi.Infrastructure.Data
{

    public static class DbStoredProcedureExecutor
    {


        private static string? _connectionString;

        // Configure once in Program.cs
        public static void Configure(string connectionString)
        {
            _connectionString = connectionString
                ?? throw new ArgumentNullException(nameof(connectionString));
        }

        private static void EnsureConfigured()
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new InvalidOperationException(
                    "DbStoredProcedureExecutor is not configured. Call Configure() in Program.cs");
        }


        public static async Task<List<T>> ExecuteAsync<T>(
            string storedProcName,
            Func<SqlDataReader, T> mapFunc,
            IEnumerable<SqlParameter>? parameters = null)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new ArgumentException("Connection string cannot be null or empty.", nameof(_connectionString));
            if (string.IsNullOrWhiteSpace(storedProcName))
                throw new ArgumentException("Stored procedure name cannot be null or empty.", nameof(storedProcName));

            ArgumentNullException.ThrowIfNull(mapFunc);

            var results = new List<T>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(storedProcName, conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
            {
                foreach (var param in parameters)
                    cmd.Parameters.Add(param);
            }

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                results.Add(mapFunc(reader));
            }

            return results;
        }


        public static async Task<List<List<T>>> ExecuteMultipleAsync<T>(
        string storedProcedure,
        Func<SqlDataReader, T> mapFunc,
        SqlParameter[] parameters)
        {
            var resultSets = new List<List<T>>();

            using var connection = new SqlConnection(_connectionString);
            using var command = new SqlCommand(storedProcedure, connection)
            {
                CommandType = System.Data.CommandType.StoredProcedure
            };

            if (parameters != null)
                command.Parameters.AddRange(parameters);

            await connection.OpenAsync();

            using var reader = await command.ExecuteReaderAsync();
            do
            {
                var resultSet = new List<T>();
                while (await reader.ReadAsync())
                {
                    resultSet.Add(mapFunc(reader));
                }
                resultSets.Add(resultSet);
            } while (await reader.NextResultAsync());

            return resultSets;
        }


        public static async Task<List<T>> ExecuteAutoMapAsync<T>(
           string storedProcName,
           IEnumerable<SqlParameter>? parameters = null) where T : new()
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new ArgumentException("Connection string cannot be null or empty.", nameof(_connectionString));
            if (string.IsNullOrWhiteSpace(storedProcName))
                throw new ArgumentException("Stored procedure name cannot be null or empty.", nameof(storedProcName));

            var results = new List<T>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(storedProcName, conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
            {
                foreach (var param in parameters)
                    cmd.Parameters.Add(param);
            }

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            // Get property info once
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Where(p => p.CanWrite)
                .ToList();

            // Build column name to index mapping
            var columnMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            for (int i = 0; i < reader.FieldCount; i++)
            {
                columnMap[reader.GetName(i)] = i;
            }

            while (await reader.ReadAsync())
            {
                var obj = new T();

                foreach (var prop in properties)
                {
                    // Try to match property name with column name (case-insensitive)
                    // Convert PascalCase to snake_case: TerminalId -> terminal_id
                    var columnName = ToSnakeCase(prop.Name);

                    if (columnMap.TryGetValue(columnName, out int ordinal))
                    {
                        var value = reader.GetValue(ordinal);

                        if (value != DBNull.Value)
                        {
                            // Handle nullable types
                            var propType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;

                            try
                            {
                                if (propType == typeof(string))
                                {
                                    prop.SetValue(obj, value?.ToString());
                                }
                                else if (propType.IsEnum)
                                {
                                    prop.SetValue(obj, Enum.ToObject(propType, value));
                                }
                                else
                                {
                                    prop.SetValue(obj, Convert.ChangeType(value, propType));
                                }
                            }
                            catch
                            {
                                // Skip properties that can't be set
                            }
                        }
                    }
                }

                results.Add(obj);
            }

            return results;
        }

        // Helper method to convert PascalCase to snake_case
        private static string ToSnakeCase(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            var result = new System.Text.StringBuilder();
            result.Append(char.ToLower(input[0]));

            for (int i = 1; i < input.Length; i++)
            {
                if (char.IsUpper(input[i]))
                {
                    result.Append('_');
                    result.Append(char.ToLower(input[i]));
                }
                else
                {
                    result.Append(input[i]);
                }
            }

            return result.ToString();
        }


        // NEW: Execute and return dynamic objects (no model needed!)
        public static async Task<List<dynamic>> ExecuteDynamicAsync(
            string storedProcName,
            IEnumerable<SqlParameter>? parameters = null)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new ArgumentException("Connection string cannot be null or empty.", nameof(_connectionString));
            if (string.IsNullOrWhiteSpace(storedProcName))
                throw new ArgumentException("Stored procedure name cannot be null or empty.", nameof(storedProcName));

            var results = new List<dynamic>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(storedProcName, conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
            {
                foreach (var param in parameters)
                    cmd.Parameters.Add(param);
            }

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var expando = new System.Dynamic.ExpandoObject() as IDictionary<string, object>;

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    var columnName = reader.GetName(i);
                    var value = reader.GetValue(i);
                    expando[columnName] = value == DBNull.Value ? null : value;
                }

                results.Add(expando);
            }

            return results;
        }

        // NEW: Execute and return Dictionary<string, object> (alternative to dynamic)
        public static async Task<List<Dictionary<string, object>>> ExecuteDictionaryAsync(
            string storedProcName,
            IEnumerable<SqlParameter>? parameters = null)
        {
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new ArgumentException("Connection string cannot be null or empty.", nameof(_connectionString));
            if (string.IsNullOrWhiteSpace(storedProcName))
                throw new ArgumentException("Stored procedure name cannot be null or empty.", nameof(storedProcName));

            var results = new List<Dictionary<string, object>>();

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(storedProcName, conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
            {
                foreach (var param in parameters)
                    cmd.Parameters.Add(param);
            }

            await conn.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                var row = new Dictionary<string, object>();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    var columnName = reader.GetName(i);
                    var value = reader.GetValue(i);
                    row[columnName] = value == DBNull.Value ? null : value;
                }

                results.Add(row);
            }

            return results;
        }

        public static async Task<int> ExecuteNonQueryAsync(
    string storedProcName,
    IEnumerable<SqlParameter>? parameters = null)
        {
            // Validate connection string
            if (string.IsNullOrWhiteSpace(_connectionString))
                throw new ArgumentException("Connection string cannot be null or empty.", nameof(_connectionString));

            // Validate SP name
            if (string.IsNullOrWhiteSpace(storedProcName))
                throw new ArgumentException("Stored procedure name cannot be null or empty.", nameof(storedProcName));

            using var conn = new SqlConnection(_connectionString);
            using var cmd = new SqlCommand(storedProcName, conn)
            {
                CommandType = CommandType.StoredProcedure
            };

            // Add parameters just like ExecuteAsync (foreach)
            if (parameters != null)
            {
                foreach (var param in parameters)
                    cmd.Parameters.Add(param);
            }

            await conn.OpenAsync();

            return await cmd.ExecuteNonQueryAsync();
        }
    }


}
