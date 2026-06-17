namespace Likyainn.Models
{
    public class Rezervasyon
    {
        public int Id { get; set; }

        public string Ad { get; set; }

        public string Soyad { get; set; }

        public string Telefon { get; set; }

        public string OdaTipi { get; set; }

        public int KisiSayisi { get; set; }

        public int YatakSayisi { get; set; }

        public DateTime GirisTarihi { get; set; }

        public DateTime CikisTarihi { get; set; }

        public decimal ToplamTutar { get; set; }

        public DateTime RezervasyonTarihi { get; set; }
    }
}
