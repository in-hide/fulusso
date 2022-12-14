using System;
using System.Text;

namespace Fulu.BouncyCastle
{
    public class HMACSHA256
    {
        public static string Compute(string data, string key)
        {
            if (string.IsNullOrEmpty(data))
            {
                throw new ArgumentNullException(nameof(data));
            }

            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentNullException(nameof(key));
            }

            using (var hmacSha256 = new System.Security.Cryptography.HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                var hash = hmacSha256.ComputeHash(Encoding.UTF8.GetBytes(data));

                return Convert.ToBase64String(hash);
            }
        }

        public static byte[] Compute(byte[] data, byte[] key)
        {
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }

            if (key == null)
            {
                throw new ArgumentNullException(nameof(key));
            }

            using (var hmacSha256 = new System.Security.Cryptography.HMACSHA256(key))
            {
                return hmacSha256.ComputeHash(data);
            }
        }
    }
}
