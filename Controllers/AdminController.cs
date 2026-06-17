using Likyainn.Data;
using Likyainn.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Likyainn.Controllers
{
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Giris()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Giris(string kullaniciAdi, string sifre)
        {
            if (kullaniciAdi == "admin" && sifre == "1234")
            {
                HttpContext.Session.SetString("Admin", "true");
                return RedirectToAction("Index");
            }

            ViewBag.Hata = "Hatalı giriş!";
            return View();
        }

        public IActionResult Index()
        {
            if (HttpContext.Session.GetString("Admin") != "true")
            {
                return RedirectToAction("Giris");
            }

            var rezervasyonlar = _context.Rezervasyonlar.ToList();

            ViewBag.ToplamUye = _context.Kullanicilar.Count();
            ViewBag.ToplamRezervasyon = _context.Rezervasyonlar.Count();
            ViewBag.ToplamKazanc = _context.Rezervasyonlar.Sum(x => x.ToplamTutar);
            ViewBag.Uyeler = _context.Kullanicilar.ToList();

            return View(rezervasyonlar);
        }

        public IActionResult Sil(int id)
        {
            var rezervasyon = _context.Rezervasyonlar.Find(id);

            if (rezervasyon != null)
            {
                _context.Rezervasyonlar.Remove(rezervasyon);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
     

public IActionResult Detay(int id)
{
    var rezervasyon = _context.Rezervasyonlar.Find(id);

    if (rezervasyon == null)
    {
        return RedirectToAction("Index");
    }

    return View(rezervasyon);
}
        }
}

