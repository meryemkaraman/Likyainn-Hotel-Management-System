@section Scripts {
    <script>

    // Doğru giriş bilgileri (öğrenci projesi için sabit tanımlı)
        var DOGRU_KULLANICI = "merowni";
        var DOGRU_SIFRE     = "merowni123";

        function girisYap() {

        var kullanici  = document.getElementById("kullaniciAdi").value;
        var sifre      = document.getElementById("sifre").value;
        var hataMesaji = document.getElementById("hataMesaji");


        if (kullanici === "" || sifre === "") {
            hataMesaji.style.display = "block";
        hataMesaji.textContent   = "⚠️ Lütfen tüm alanları doldurun.";
        return; 
        }


        if (kullanici === DOGRU_KULLANICI && sifre === DOGRU_SIFRE) {
            hataMesaji.style.display = "none"; // Hata mesajını gizle
        alert("🎉 Hoş geldiniz! Tüm odalarda %10 indiriminiz uygulandı.");

        window.location.href = "/Home/Odalar?uyeGiris=true";


        } else {
            hataMesaji.style.display = "block";
        hataMesaji.textContent   = "❌ Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.";
        }
    }

        // Enter tuşuna basınca da giriş yapılsın
        document.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            girisYap();
        }
    });

    </script>
}







@section Scripts {
<script>

    // Sayfa açılınca bugünün tarihini minimum değer olarak ayarla
    var bugun = new Date().toISOString().split('T')[0];
    document.getElementById("girisT").setAttribute("min", bugun);
    document.getElementById("cikisT").setAttribute("min", bugun);

    // Tarih veya oda tipi değişince özet hesapla
    document.getElementById("girisT").addEventListener("change", hesaplaOzet);
    document.getElementById("cikisT").addEventListener("change", hesaplaOzet);
    document.getElementById("odaTipi").addEventListener("change", hesaplaOzet);

    function hesaplaOzet() {
        var giris   = document.getElementById("girisT").value;
        var cikis   = document.getElementById("cikisT").value;
        var odaTipi = document.getElementById("odaTipi").value;

        // Her üç alan da doluysa hesapla
        if (giris && cikis && odaTipi) {
            var girisDate   = new Date(giris);
            var cikisDate   = new Date(cikis);
            // Milisaniyeyi güne çevir
            var geceSayisi  = Math.round((cikisDate - girisDate) / (1000 * 60 * 60 * 24));

            // Oda fiyat tablosu
            var fiyatlar = {
                "Standart Oda": 1200,
                "Suit Oda":     2500,
                "Deluxe Oda":   3800,
                "Aile Odasi":   4200
            };

            // Gece sayısı pozitifse göster
            if (geceSayisi > 0 && fiyatlar[odaTipi]) {
                var toplamFiyat = geceSayisi * fiyatlar[odaTipi];
                document.getElementById("ozetKutu").style.display = "block";
                document.getElementById("ozetIcerik").innerHTML =
                    "🛏️ <b>" + odaTipi + "</b> · " +
                    geceSayisi + " gece · " +
                    "<b>" + toplamFiyat.toLocaleString('tr-TR') + " ₺</b>";
            }
        }
    }

    function odemeGec() {
        // Tüm alanları oku
        var isim    = document.getElementById("isim").value.trim();
        var soyisim = document.getElementById("soyisim").value.trim();
        var telefon = document.getElementById("telefon").value.trim();
        var odaTipi = document.getElementById("odaTipi").value;
        var girisT  = document.getElementById("girisT").value;
        var cikisT  = document.getElementById("cikisT").value;
        var hata    = document.getElementById("hataMesaji2");

        // Boş alan kontrolü
        if (!isim || !soyisim || !telefon || !odaTipi || !girisT || !cikisT) {
            hata.style.display = "block";
            hata.textContent   = "⚠️ Lütfen tüm alanları doldurun!";
            return;
        }

        // Tarih mantığı: çıkış girişten önce olamaz
        if (new Date(cikisT) <= new Date(girisT)) {
            hata.style.display = "block";
            hata.textContent   = "⚠️ Çıkış tarihi, giriş tarihinden sonra olmalıdır!";
            return;
        }

        // Her şey tamam → Onay sayfasına yönlendir (bilgileri URL ile taşı)
        hata.style.display = "none";
        window.location.href = "/Home/Onay"
            + "?isim="    + encodeURIComponent(isim)
            + "&soyisim=" + encodeURIComponent(soyisim)
            + "&odaTipi=" + encodeURIComponent(odaTipi)
            + "&giris="   + girisT
            + "&cikis="   + cikisT;
    }

</script>
}











@section Scripts {
    <script>

    /* ------------------------------------------
        Kart numarası formatlama: 1234567890123456
        → otomatik olarak 1234 5678 9012 3456 yapar
        ------------------------------------------ */
        function kartNoFormatla(input) {
        // Sadece rakamları al, max 16 hane
        var val       = input.value.replace(/\D/g, '').substring(0, 16);
        // Her 4 rakamdan sonra boşluk ekle
        var formatted = val.replace(/(.{4})/g, '$1 ').trim();
        input.value   = formatted;

        // Kart görseline yansıt (eksik haneleri nokta ile doldur)
        var displayVal = val.padEnd(16, '•');
        var display    = displayVal.replace(/(.{4})/g, '$1 ').trim();
        document.getElementById("kartNoDisplay").textContent = display;
    }

        /* ------------------------------------------
           Son kullanma tarihi formatlama: 1224 → 12/24
        ------------------------------------------ */
        function sonKullanmaFormatla(input) {
        var val = input.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) {
            input.value = val.substring(0, 2) + '/' + val.substring(2);
        } else {
            input.value = val;
        }
    }

        /* ------------------------------------------
           Ödemeyi Tamamla butonu
        ------------------------------------------ */
        function odemiTamamla() {
        var kartNo      = document.getElementById("kartNo").value.replace(/\s/g, '');
        var kartAd      = document.getElementById("kartAd").value.trim();
        var sonKullanma = document.getElementById("sonKullanma").value;
        var cvv         = document.getElementById("cvv").value.trim();
        var hata        = document.getElementById("odemeHata");

        // Boş alan kontrolü
        if (!kartNo || !kartAd || !sonKullanma || !cvv) {
            hata.style.display = "block";
        hata.textContent   = "⚠️ Lütfen tüm kart bilgilerini doldurun!";
        return;
        }

        // Kart numarası 16 hane olmalı
        if (kartNo.length !== 16) {
            hata.style.display = "block";
        hata.textContent   = "⚠️ Kart numarası 16 haneli olmalıdır!";
        return;
        }

        // CVV 3 hane olmalı
        if (cvv.length < 3) {
            hata.style.display = "block";
        hata.textContent   = "⚠️ CVV 3 haneli olmalıdır!";
        return;
        }

        // Tüm kontroller geçti:
        // → Ödeme formunu gizle
        document.getElementById("odemeFormu").style.display    = "none";
        // → Değerlendirme bölümünü göster
        document.getElementById("degerlendirmeBolum").style.display = "block";
    }

        /* ------------------------------------------
           Yıldız seçildiğinde mesaj göster
        ------------------------------------------ */
        function yildizSec(puan) {
        var mesajTesekkur = document.getElementById("mesajTesekkur");
        var mesajGeri     = document.getElementById("mesajGeri");

        // Önceki mesajları önce gizle
        mesajTesekkur.style.display = "none";
        mesajGeri.style.display     = "none";

        if (puan === 5) {
            // 5 yıldız seçildiyse: Teşekkürler mesajı
            mesajTesekkur.style.display = "block";
        } else {
            // 1–4 yıldız seçildiyse: Geri bildirim alındı mesajı
            mesajGeri.style.display = "block";
        }

        // Yıldızlara bir daha tıklanamaz hale getir
        setTimeout(function() {
            document.getElementById("yildizContainer").style.opacity = "0.5";
        document.getElementById("yildizContainer").style.pointerEvents = "none";
        }, 300);
    }

    </script>
}
