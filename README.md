E-commerce-for-begin, kullanıcıların ürünleri görüntüleyip sepete ekleyerek satın alma işlemlerini gerçekleştirebildiği bir e-ticaret uygulamasıdır. Uygulama, kullanıcı dostu bir arayüz sunarak basit ve etkili bir alışveriş deneyimi sağlar.

Kullanılan Teknolojiler
React: Kullanıcı arayüzü oluşturmak için.
React Router: Sayfalar arası geçişler için.
Redux: Uygulama durumunu yönetmek için.
Tailwind CSS: Hızlı ve özelleştirilebilir stil için.
Axios: API istekleri için.
@tanstack/react-query: Veri yönetimi ve sorgulama için.
react-hook-form: Form yönetimi için.
react-icons: İkonlar için.
react-select: Özel seçim bileşenleri için.
react-toastify: Kullanıcı bildirimleri için.

Kurulum Talimatları

Projenin Klonlanması:

git clone https://github.com/aliyzbsi/E-commerce-for-begin.git

Bağımlılıkların Yüklenmesi: Proje dizinine gidin ve bağımlılıkları yüklemek için:

cd E-commerce-for-begin

npm install

Geliştirme Sunucusunu Başlatma:

npm run dev
Tarayıcınızda http://localhost:3000 adresine gidin.
Temel Bileşenler
Header: Uygulamanın üst kısmındaki gezinme çubuğu.
Home: Products componentinin görüntülendiği basit bir filtreleme işlemi yapılan bileşen.
Products: Tüm ürünleri listeleyen bileşen.
MainContent: Kullanıcı durumuna ve beklenen değerlere göre route yönlendirmelerinin yapıldığı bileşen
Sidebar:Bulunduğu pathname ' e göre farklı fonksiyonlar gerçekleştiren bileşen.
Basket: Kullanıcının sepetini görüntüleyen bileşen.
Login: Kullanıcı giriş işlemleri için.
Önemli Notlar
Projeyi geliştirmek için React ve Redux bilgisine sahip olmak faydalıdır.
API ile entegre çalışmak için gerekli ayarların yapılması gerekebilir.
