# remotion-shorts-kit

1080x1920 dikey açıklayıcı (explainer) videoları programatik olarak üretmek için açık kaynak Remotion başlangıç kiti.

![remotion-shorts-kit önizleme](docs/demo-preview.svg)

## Genel Bakış

YouTube Shorts, TikTok ve Instagram Reels için teknik veya bilimsel mekanizmaları anlatan dikey videolar üretmek son derece popülerdir. Ancak geliştiriciler ve içerik üreticileri her projede aynı altyapıyı sıfırdan kurmak zorunda kalır: kelime seviyesinde vurgulanan altyazı motoru, sahne zaman çizelgesi, maskot poz geçişleri, yönlendirme okları, vurgu kartları ve platform güvenli alan sınırları.

`remotion-shorts-kit`, Remotion 4, React, katı TypeScript modu ve Zod üzerine inşa edilmiş tip güvenli ve test edilmiş bir temel sağlar. İçerik ve yaratıcı varlıkları render mantığından tamamen ayırarak video üretimini yapılandırılmış JSON verisiyle yönetmenize olanak tanır.

## Özellikler

- **Veri Odaklı Mimari**: Zod ile doğrulanmış tam kapsamlı zaman çizelgesi şeması (`src/schema.ts`).
- **Kelime Seviyesinde Animasyonlu Altyazılar**: Kelime zaman damgalarıyla senkronize, akıllı 1-2 satır bölme, duraklama algılama, güvenli alan hizalaması ve aktif kelime vurgulama efekti.
- **SVG Maskot Sistemi**: Orijinal geometrik robot karakter ("Pip"), 5 farklı poz (`idle`, `talking`, `explaining`, `thinking`, `surprised`) ve esneme/sıçrama giriş dinamikleri.
- **Görsel Vurgu ve İşaretçiler**: Yay mekanizmalı `<Callout>` bilgi kartları, dikkat çeken titreşimli `<Arrow>` bezier okları ve `<ZoomTo>` kamera odaklama bileşenleri.
- **Güvenli Alan Kılavuzu**: Shorts/TikTok/Reels arayüzünden kaçınmak için temkinli bir bölgeyi gösteren, yalnız Studio'da görünen katman (`<SafeAreaOverlay>`). `showInRender` ile açıkça istemedikçe `remotion render` çıktısına girmez. `platform` özelliği yalnız etiketi değiştirir; ölçüler ortak ve temkinlidir.
- **Kapsamlı Test Kapsamına Sahip Saf Yardımcılar**: Zaman-kare dönüşümü, satır bölme, sahne arama ve yumuşatma eğrileri için birim testleri.
- **Üretime Hazır Render Altyapısı**: Remotion Studio ile canlı inceleme ve Remotion CLI ile MP4 dışa aktarma komutları; kompozisyon süresi, fps ve boyut timeline'dan hesaplanır.

## Hızlı Başlangıç

### Gereksinimler

- Node.js >= 20.0.0
- npm >= 10.0.0

### Kurulum

```bash
git clone https://github.com/YusufBeratZengin/remotion-shorts-kit.git
cd remotion-shorts-kit
npm install
```

### Studio'yu Başlatma

Animasyonları, sahne geçişlerini ve düzeni görsel olarak test etmek için etkileşimli Remotion Studio'yu açın:

```bash
npm run studio
```

### Demo Videoyu Render Alma

"Termos Çayı Nasıl Sıcak Tutar?" konulu 20 saniyelik 1080x1920 demo kompozisyonunu `out/demo.mp4` olarak render alın:

```bash
npm run render:demo
```

### Test ve Kod Kalitesi

```bash
# Vitest birim testlerini çalıştır
npm run test

# Katı TypeScript derleyici denetimi
npm run typecheck

# Biome linter denetimi
npm run lint

# Biome format ve linter düzeltmelerini otomatik uygula
npm run lint:fix
```

## Zaman Çizelgesi (Timeline) JSON Referansı

Tüm video akışı bir `Timeline` nesnesi ile yönetilir. Şema `src/schema.ts` dosyasında Zod ile tanımlanmıştır.

### Ana Alanlar

| Alan | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `fps` | `number` | `30` | Saniye başına kare sayısı. |
| `width` | `number` | `1080` | Video piksel genişliği. |
| `height` | `number` | `1920` | Video piksel yüksekliği. |
| `scenes` | `Scene[]` | (Zorunlu) | Sıralı sahne listesi. |
| `captions` | `Word[]` | `[]` | Kelime bazlı zaman damgalı transkripsiyon. |
| `audio` | `AudioConfig` | `undefined` | İsteğe bağlı seslendirme veya müzik dosyası. |
| `captionStyle`| `CaptionStyle`| `{}` | Altyazı tipografi ve görsel stil ayarları. |
| `showProgressBar` | `boolean` | `true` | Alt veya üst ilerleme çubuğu. |
| `showSafeArea` | `boolean` | `false` | Güvenli alan kılavuzu (yalnız Studio/Player; `remotion render` çıktısında görünmez). |

### Sahne Tanımı Örneği

```json
{
  "id": "scene-1-intro",
  "start": 0.0,
  "end": 4.0,
  "background": "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
  "title": "Sıcak Çay Gizemi",
  "mascot": {
    "pose": "thinking",
    "x": 540,
    "y": 1320,
    "scale": 1.15,
    "flip": false
  },
  "elements": [
    {
      "type": "callout",
      "id": "temp-callout",
      "x": 540,
      "y": 660,
      "title": "Buharı Üstünde",
      "text": "Bir termos çayı 12 saat boyunca nasıl sıcak tutar?",
      "accentColor": "#f59e0b"
    }
  ]
}
```

### Sahne Elemanları

- **Callout (`type: "callout"`)**: Vurgu çizgisi, başlık, metin ve isteğe bağlı simge içeren bilgi kartı.
- **Arrow (`type: "arrow"`)**: `(fromX, fromY)` noktasından `(toX, toY)` noktasına uzanan kavisli/düz yön oku.
- **Zoom (`type: "zoom"`)**: Sahne esnasında kamerayı belirli koordinatlara yaklaştıran odak bileşeni.

## Bileşen Özellikleri (Props)

### `<Captions>`

Altyazıları 1-2 satırlık bloklara bölerek kelime kelime vurgulayan bileşen.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `captions` | `Word[]` | (Zorunlu) | `{ text, start, end }` dizisi. |
| `style` | `Partial<CaptionStyle>` | `{}` | Görsel stil geçersiz kılmaları. |
| `batchingOptions` | `BatchingOptions` | `{}` | Satır bölme sınırları (maksimum karakter, satır sayısı, duraklama süresi). |
| `className` | `string` | `undefined` | İsteğe bağlı CSS sınıfı. |

### `<Mascot>`

Poz değişimlerinde esneme ve yaylanma animasyonu yapan orijinal vektör karakter.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `pose` | `MascotPose` | (Zorunlu) | `"idle"` \| `"talking"` \| `"explaining"` \| `"thinking"` \| `"surprised"`. |
| `x` | `number` | (Zorunlu) | Yatay merkez koordinatı (piksel). |
| `y` | `number` | (Zorunlu) | Dikey merkez koordinatı (piksel). |
| `scale` | `number` | `1` | Ölçek katsayısı. |
| `flip` | `boolean` | `false` | Karakteri yatayda aynalar. |
| `enterFrame` | `number` | `useCurrentFrame()` | Giriş yay animasyonunun başlangıç karesi. |

### `<Callout>`

Yaylanarak beliren görsel açıklama kartı.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `text` | `string` | (Zorunlu) | Açıklama metni. |
| `x` | `number` | (Zorunlu) | Kart merkez yatay konumu. |
| `y` | `number` | (Zorunlu) | Kart merkez dikey konumu. |
| `title` | `string` | `undefined` | Kart başlığı. |
| `icon` | `string` | `undefined` | Sol rozet simgesi. |
| `accentColor` | `string` | `"#38bdf8"` | Kenarlık ve vurgu rengi. |
| `backgroundColor` | `string` | `"rgba(15,23,42,0.90)"` | Kart arka plan rengi. |

### `<Arrow>`

İki nokta arasında çizilen animasyonlu yönlendirme oku.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `fromX` | `number` | (Zorunlu) | Başlangıç X koordinatı. |
| `fromY` | `number` | (Zorunlu) | Başlangıç Y koordinatı. |
| `toX` | `number` | (Zorunlu) | Hedef X koordinatı. |
| `toY` | `number` | (Zorunlu) | Hedef Y koordinatı. |
| `label` | `string` | `undefined` | Ok gövdesinde duran açıklama etiketi. |
| `color` | `string` | `"#f59e0b"` | Ok çizgi ve uç rengi. |
| `strokeWidth` | `number` | `8` | Çizgi kalınlığı. |
| `curvature` | `number` | `0` | Kavis payı (0 düz çizgidir). |

### `<ZoomTo>`

İçeriği belirli bir hedefe doğru yaklaştıran kamera bileşeni.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `targetX` | `number` | (Zorunlu) | Odaklanılacak X koordinatı. |
| `targetY` | `number` | (Zorunlu) | Odaklanılacak Y koordinatı. |
| `scale` | `number` | `1.3` | Yakınlaşma ölçeği. |
| `startFrame` | `number` | `0` | Yakınlaşmanın başlayacağı kare. |
| `durationFrames` | `number` | `30` | Geçiş süresi (kare cinsinden). |
| `children` | `ReactNode` | (Zorunlu) | Yakınlaştırılacak sahne elemanları. |

### `<ProgressBar>`

Video oynatma sürecini gösteren ilerleme çubuğu.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `position` | `"top"` \| `"bottom"` | `"bottom"` | Ekrandaki konumu. |
| `height` | `number` | `8` | Çubuk kalınlığı (piksel). |
| `color` | `string` | `"#38bdf8"` | Dolgu rengi. |
| `backgroundColor` | `string` | `"rgba(255,255,255,0.18)"` | Ray rengi. |

### `<SafeAreaOverlay>`

Dikey platform arayüz güvenli alanlarını gösteren denetim katmanı.

| Prop | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| `visible` | `boolean` | `false` | Katmanın gösterilip gösterilmeyeceği. |
| `platform` | `SafeAreaPlatform` | `"all"` | `"all"` \| `"youtube-shorts"` \| `"tiktok"` \| `"instagram-reels"`. |
| `opacity` | `number` | `0.85` | Kılavuz opaklığı. |
| `showInRender` | `boolean` | `false` | Katmanı `remotion render` / `remotion still` çıktısına da çizer. |

## Kendi Seslendirmeniz (TTS) ve Whisper Kelime Zaman Damgalarını Kullanma

Kit, otomatik seslendirme ve transkripsiyon boru hatlarıyla kolayca birleşecek biçimde tasarlanmıştır.

### 1. Seslendirmenin Üretilmesi (Örn. OpenAI TTS veya ElevenLabs)

```bash
# OpenAI TTS API ile ses dosyası oluşturma
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "tts-1",
    "input": "Bir termos çayı nasıl saatlerce sıcak tutar? Isı iletim, taşınım ve ışıma olmak üzere üç yolla yayılır...",
    "voice": "alloy"
  }' \
  --output public/seslendirme.mp3
```

### 2. Whisper ile Kelime Seviyesinde Zaman Damgası Çıkarma

Python'da `faster-whisper` kullanarak kelime zaman damgalarını JSON formatında kaydedin:

```python
from faster_whisper import WhisperModel
import json

model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe("public/seslendirme.mp3", word_timestamps=True)

words = []
for segment in segments:
    for word in segment.words:
        words.append({
            "text": word.word.strip(),
            "start": round(word.start, 2),
            "end": round(word.end, 2),
            "confidence": round(word.probability, 2)
        })

with open("captions.json", "w", encoding="utf-8") as f:
    json.dump(words, f, indent=2, ensure_ascii=False)

print(f"{len(words)} adet kelime zaman damgası çıkarıldı.")
```

### 3. Zaman Çizelgesi JSON'ına Entegre Etme

Oluşturulan kelime dizisini timeline dosyanıza yerleştirin:

```json
{
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "audio": {
    "src": "/seslendirme.mp3",
    "volume": 1.0
  },
  "captions": [
    { "text": "Bir", "start": 0.15, "end": 0.40 },
    { "text": "termos", "start": 0.40, "end": 0.85 }
  ],
  "scenes": [...]
}
```

Ardından `npm run render:demo` veya kendi render komutunuz ile videonuzu oluşturun.

## Dikey Video Güvenli Alan Standartları

Dikey video platformlarında ekranın kenarları kullanıcı arayüzü butonları ile kaplıdır:

- **Üst Risk Bölgesi (0 - 200px)**: Arama kutusu, ses seçici ve durum simgeleri yer alır.
- **Sağ Risk Sütunu (920px - 1080px)**: Beğeni, yorum, paylaşma ve müzik simgeleri bulunur.
- **Alt Risk Bölgesi (1440px - 1920px)**: Profil resmi, takip butonu, video başlığı ve ilerleme çubuğu yer alır.
- **Güvenli İçerik Alanı**: `sol: 60px`, `üst: 200px`, `sağ: 180px`, `alt: 480px`. Tüm temel çizimler, oklar ve maskot bu sınırın içinde tutulmalıdır. Altyazılar varsayılan olarak `positionBottom: 500` ve 180px sağ boşlukla bu kutunun içinde kalır. Katman yalnız geliştirme aracıdır; son render'a varsayılan olarak girmez.

## Proje Dizini

```
remotion-shorts-kit/
├── .github/workflows/ci.yml    # Çoklu platform GitHub Actions CI
├── docs/demo-preview.svg       # Önizleme ve mimari çizimi
├── examples/demo-timeline.json # 20 saniyelik termos anlatımı zaman çizelgesi
├── src/
│   ├── assets/mascot/          # Orijinal vektör SVG maskot dosyaları
│   ├── components/             # Yeniden kullanılabilir video bileşenleri
│   ├── compositions/           # Üst seviye Remotion kompozisyonları
│   ├── examples/               # Örnek uygulama dosyaları
│   ├── helpers/                # Saf fonksiyonlar ve matematik algoritmaları
│   ├── Root.tsx                # Remotion Root kayıtları
│   ├── schema.ts               # Zod şemaları ve TypeScript tipleri
│   └── index.ts                # Kütüphane giriş noktası
└── tests/                      # Vitest birim testleri
```

## Katkıda Bulunma

Geliştirme süreci ve kurallar için [CONTRIBUTING.md](CONTRIBUTING.md) belgesini inceleyin.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakınız.

Telif Hakkı (c) 2026 Yusuf Berat Zengin.
