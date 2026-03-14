# 🚀 Raid Alarm Mobil Uygulaması

Bu klasör, Rust+ sismik sensör bildirimlerini dinleyip **yerel telefon alarmını** çalan React Native uygulamasının tüm kodlarını içerir.

Bilgisayarınızda gigabaytlarca Android aracı kurmanıza gerek kalmadan bu uygulamayı bir `.apk` dosyasına dönüştürmeniz (derlemeniz) için her şeyi hazırladım.

## 🛠️ APK Dosyasını Nasıl Alırsınız? (3 Adım)

1. **GitHub'a Yükleyin:**
   Kendi GitHub hesabınıza gidin, yeni (boş) bir Public ya da Private depo (repository) oluşturun.
   Bu klasörün (`C:\Users\utkan\Desktop\RaidAlarmApp`) içindeki tüm dosyaları o GitHub deposuna yükleyin (Push işlemi veya sürükle-bırak).

2. **Otomatik Derlemeyi Bekleyin:**
   Dosyalar yüklendiği anda, GitHub'ın bulut sunucuları yazdığım bot sayesinde (`.github/workflows/build-apk.yml`) otomatik olarak çalışmaya başlayacaktır.
   Deponuzdaki **"Actions"** veya **"Releases"** sekmesine tıklayarak inşa sürecini izleyebilirsiniz. Yaklaşık 3-5 dakika sürecektir.

3. **İndirin ve Kurun:**
   İşlem bittiğinde, "Actions" sayfasında **RaidSiren-APK** adında bir indirilebilir dosya belirecektir.
   Bu dosyayı indirip `.zip`'ten çıkarın, içindeki `app-release.apk` dosyasını kendinize ve arkadaşlarınıza yollayarak telefonlarınıza kurabilirsiniz.

*(Kurulum sonrası uygulamayı bir kez açıp "İzin Ver" demeniz yeterlidir, sonrasında sonsuza dek Rust+ üzerinden arka planda uyanıp siren çalacaktır.)*
