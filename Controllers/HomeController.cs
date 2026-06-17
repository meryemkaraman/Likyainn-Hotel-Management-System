using System.Diagnostics;
using Likyainn.Models;
using Likyainn.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Likyainn.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }


        public IActionResult Index()
            {
                return View();
            }


            public IActionResult Giris()
            {
                return View();
            }
        [HttpPost]
        public IActionResult Giris(string kullaniciAdi, string sifre)
        {
            var kullanici = _context.Kullanicilar
                .FirstOrDefault(x =>
                    x.KullaniciAdi == kullaniciAdi &&
                    x.Sifre == sifre);

            if (kullanici != null)
            {
                HttpContext.Session.SetString("UyeGiris", "true");
                HttpContext.Session.SetString("KullaniciAdi", kullanici.Ad);

                return RedirectToAction("Index");
            }

            ViewBag.Hata = "Kullanıcı adı veya şifre hatalı.";

            return View();
        }


        public IActionResult Kayit()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Kayit(Kullanici kullanici)
        {
            _context.Kullanicilar.Add(kullanici);
            _context.SaveChanges();

            return RedirectToAction("Giris");
        }


        public IActionResult Odalar()
            {

                bool uyeGiris = HttpContext.Session.GetString("UyeGiris") == "true";
                ViewBag.UyeGiris = uyeGiris;


                var fiyatlar = new Dictionary<string, decimal>
            {
                { "Standart", 1200 },
                { "Suit",     2500 },
                { "Deluxe",   3800 },
                { "Aile",     4200 }
            };


                if (uyeGiris)
    {
        foreach (var oda in fiyatlar.Keys.ToList())
        {
            fiyatlar[oda] = Math.Round(fiyatlar[oda] * 0.90m, 0);
        }
    }

    ViewBag.Fiyatlar = fiyatlar;

    return View();
}
        public IActionResult Profil()
        {
            var kullaniciAdi = HttpContext.Session.GetString("KullaniciAdi");

            if (kullaniciAdi == null)
            {
                return RedirectToAction("Giris");
            }

            // Kullanıcıyı DB'den çek
            var kullanici = _context.Kullanicilar
                .FirstOrDefault(x => x.KullaniciAdi == kullaniciAdi);

            // Kullanıcının rezervasyonlarını çek
            var rezervasyonlar = _context.Rezervasyonlar
                .Where(x => x.Ad == kullaniciAdi)
                .ToList();

            // View'a gönder
            ViewBag.Kullanici = kullanici;
            ViewBag.Rezervasyonlar = rezervasyonlar;

            return View();
        }


        public IActionResult Detay(string id)
            {

                var odaBilgileri = new Dictionary<string, (string Ad, string Aciklama, string Emoji)>
            {
                { "standart", ("Standart Oda", "Ferah ve konforlu Standart odalarımız deniz manzarasıyla huzurlu bir tatil sunar. Modern dekorasyon ve tam donanımıyla rahat bir konaklama deneyimi yaşarsınız.", "🛏️") },
                { "suit",     ("Suit Oda",     "Geniş oturma alanı ve özel terasıyla Suit odalarımız, Fethiye koyunun muhteşem manzarasına karşı lüks bir deneyim sunmaktadır.",                          "🌅") },
                { "deluxe",   ("Deluxe Oda",   "Jakuzi ve özel balkonuyla Deluxe odalarımız, unutulmaz bir tatil deneyimi için tüm detaylar düşünülerek tasarlanmıştır.",                                 "✨") },
                { "aile",     ("Aile Odası",   "İki ayrı yatak odasıyla birbirine bağlı Aile odalarımız, aile tatillerini en konforlu hale getirecek şekilde planlanmıştır.",                             "👨‍👩‍👧‍👦") }
            };

                if (id != null && odaBilgileri.ContainsKey(id.ToLower()))
                {
                    var oda = odaBilgileri[id.ToLower()];
                    ViewBag.OdaId = id.ToLower();
                    ViewBag.OdaAd = oda.Ad;
                    ViewBag.OdaAciklama = oda.Aciklama;
                    ViewBag.OdaEmoji = oda.Emoji;
                }
                else
                {
                    return RedirectToAction("Odalar");
                }

                return View();
            }


            public IActionResult Rezervasyon()
            {
                return View();
            }


            public IActionResult Onay()
            {
                return View();
            }
        [HttpPost]
        
        public JsonResult RezervasyonKaydet([FromBody] Rezervasyon rezervasyon)
        {
            rezervasyon.RezervasyonTarihi = DateTime.Now;

            _context.Rezervasyonlar.Add(rezervasyon);
            _context.SaveChanges();

            return Json(new { success = true });
        }


    }
}

