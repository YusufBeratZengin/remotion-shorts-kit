# remotion-shorts-kit
[![CI](https://github.com/YusufBeratZengin/remotion-shorts-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/YusufBeratZengin/remotion-shorts-kit/actions/workflows/ci.yml) [![npm](https://img.shields.io/npm/v/remotion-shorts-kit)](https://www.npmjs.com/package/remotion-shorts-kit) [![MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE) [![Remotion 4](https://img.shields.io/badge/Remotion-4-blue)](https://www.remotion.dev/) [![Node](https://img.shields.io/badge/node-%3E%3D20-green)](package.json)
[English](README.md) | [Türkçe](README.tr.md)

Remotion 4 ve strict TypeScript ile 1080×1920 dikey anlatım videoları üreten; klonlanarak başlangıç kiti, kurulup React kütüphanesi olarak kullanılabilen bir proje.
Tip güvenli JSON timeline, güvenli alanı gözeten kelime bazlı altyazılar ve yalnızca özgün görseller, içeriği tekrar kullanılabilir ve tutarlı tutar.
Kütüphaneyi kurun: `npm install remotion-shorts-kit react@18 react-dom@18 remotion@4`
Kurulumdan sonra CLI'ı deneyin: `npx shorts-kit validate node_modules/remotion-shorts-kit/examples/demo-timeline.json`
![Render alınmış termos anlatımından yedi saniyelik kesit](docs/demo.gif)

## Demo

GIF, gerçek 20 saniyelik `ThermosExplainer` çıktısından alınmış 540×960 bir kesittir; boyutu 3 MB'ın altındadır. [Durağan alternatif](docs/demo-preview.svg).

JSON → şema varsayılanları ve doğrulama → kompozisyon:

```tsx
import { ExplainerShort, TimelineSchema } from "remotion-shorts-kit";

const timeline = TimelineSchema.parse({
  scenes: [{ id: "intro", start: 0, end: 5, background: "#0f172a" }],
  captions: [{ text: "Merhaba!", start: 0.2, end: 1.2 }],
});
export const MyShort = () => <ExplainerShort timeline={timeline} />;
```

`MyShort` bileşenini kendi Remotion projenizin root'unda kaydedin. Kütüphaneyi import etmek root kaydı yapmaz ve örnek kompozisyonları yüklemez.

## Genel Bakış

Sahne sıralaması, altyazı düzeni, maskot pozları, bilgi kartları, oklar ve kamera hareketleri için altyapı kurmak yerine timeline'ı düzenleyin. Studio ve örnek kompozisyonlar için depoyu klonlayın; mevcut Remotion projenizde ise bileşenleri import edin.

## Özellikler

- Bileşenler, yardımcılar ve timeline için Zod şemaları ve TypeScript bildirimleri.
- Kareye göre kelime vurgusu, önbelleğe alınan satır düzeni ve duraklamaya göre altyazı grupları.
- Beş pozuyla özgün SVG robot Pip: idle, talking, explaining, thinking ve surprised.
- Bilgi kartları, eğri oklar, kamera odağı, ilerleme çubuğu ve güvenli alan kılavuzu.
- Timeline doğrulama ve Whisper kelimelerini dönüştürme için yerel CLI.

## Kurulum

Kütüphane kullanımı için yukarıdaki komutla paketi ve React 18 / Remotion 4 peer bağımlılıklarını kurun. Zod çalışma zamanı bağımlılığıdır. Paket ESM kullanır; CommonJS `require()` desteklenmez. npm rozeti registry'deki durumu gösterir; ilk yayına kadar başlangıç kitinin kaynak kodunu kullanın.

## Hızlı Başlangıç

### Gereksinimler

Node.js 20 veya üzeri ve npm gerekir. Render için desteklenen bir Chromium kurulumu da gerekir; Remotion ilk render sırasında tarayıcı indirebilir.

### Depoyu Kurma

```bash
git clone https://github.com/YusufBeratZengin/remotion-shorts-kit.git
cd remotion-shorts-kit
npm ci
```

### Studio'yu Başlatma

```bash
npm run studio
```

### Demo Videoyu Render Alma

```bash
npm run render:demo
npm run render:example2
```

Çıktılar: `out/demo.mp4` (20 saniye) ve `out/siphon.mp4` (15 saniye); ikisi de 1080×1920, 30 fps. Örnekler sessizdir; seslendirmeyi siz ekleyin.

### Test ve Kod Kalitesi

Tüm kontroller [Geliştirme](#geliştirme) bölümündedir.

## Kullanım

Kurulu `shorts-kit` komutu doğrudan timeline JSON dosyası alır:

```bash
node bin/shorts-kit.mjs validate examples/demo-timeline.json
```

Kurulu pakette `node bin/shorts-kit.mjs` yerine `npx shorts-kit` kullanın. Bozuk JSON, şema hatası veya geçersiz argüman çıkış kodunu 1 yapar. Doğrulama mesajları `$.captions[1].start` gibi JSON yolları içerir.

`TimelineSchema.parse(json)` ve `parseTimeline(json)` varsayılanları uygulanmış timeline döndürür; geçersiz veride hata fırlatır. `validateTimeline(json)`, `{ ok: true, errors: [], data }` veya `{ ok: false, errors: string[] }` döndürür. `safeParseTimeline`, Zod sonuç biçimini korur.

## Örnekler

- [Termos timeline'ı](examples/demo-timeline.json): ısı aktarımı, 20 saniye; `ThermosExplainer`.
- [Sifon timeline'ı](examples/second-timeline.json): dolu boru, aşağıdaki çıkış ve havanın akışı kesmesi, 15 saniye; `SiphonExplainer`, iki maskot pozu.
- [Whisper test verisi](tests/fixtures/whisper.json): CLI'ı denemek için yapay kelime zaman damgaları.

## Zaman Çizelgesi (Timeline) JSON Referansı

Tam şema [src/schema.ts](src/schema.ts) dosyasındadır. Sahne sırası korunur; sahneler zaman olarak çakışamaz. Altyazı kelimeleri sıralı olmalı ve çakışmamalıdır. Bir öğenin bittiği anda diğeri başlayabilir.

### Ana Alanlar

| Alan | Varsayılan | Anlamı |
| --- | --- | --- |
| `scenes` | zorunlu | `id`, `start`, `end`, `background` içeren, boş olmayan sahne dizisi |
| `fps`, `width`, `height` | `30`, `1080`, `1920` | Kare hızı ve tuval boyutu |
| `captions` | `[]` | Kelimeler: `{ text, start, end, confidence? }`; süreler saniye |
| `audio` | yok | `{ src, volume: 1, startOffset: 0 }`; başlangıç ofseti saniye |
| `captionStyle` | şema varsayılanları | Yazı tipi, vurgu, satır düzeni ve altyazı konumu |
| `showSafeArea` | `false` | Studio/Player kılavuzu; son çıktıda varsayılan olarak gizli |
| `showProgressBar` | `true` | Oynatma ilerlemesi |

### Sahne Tanımı Örneği

Her sahnede `id`, `start`, `end` (saniye) ve CSS `background` bulunur. `title`, `mascot` ve `elements` isteğe bağlıdır. `mascot`, `{ pose, x, y, scale: 1, flip: false }` alır. `x`/`y` tuval koordinatlarıdır.

### Sahne Elemanları

- `callout`: `id`, `x`, `y`, `text`; isteğe bağlı `title`, `icon` ve renkler.
- `arrow`: `id`, `fromX`, `fromY`, `toX`, `toY`; isteğe bağlı etiket, renk, çizgi kalınlığı ve eğrilik.
- `zoom`: `id`, `targetX`, `targetY`; isteğe bağlı `scale` ve `durationFrames`.

Tüm öğeler sahnenin başlangıcına göre saniye cinsinden `start`/`end` ofseti alabilir. Bitiş anı aralığa dahil değildir.

## Bileşen Özellikleri (Props)

Dışa aktarılan tüm prop tipleri için [bileşen bildirimlerine ve kaynak koduna](src/components/index.ts) bakın. Kütüphane ve başlangıç kiti aynı bileşen prop'larını kullanır.

### `<Captions>`

`captions: Word[]` zorunludur. `style: Partial<CaptionStyle>`, `batchingOptions` ve `className` isteğe bağlıdır. Varsayılan düzen iki satır, satır başına 18 karakter, alttan 500 px ve soldan/sağdan 60/180 px boşluktur.

### `<Mascot>`

`pose`, `x`, `y` zorunlu; `scale`, `flip`, `enterFrame`, `className` ve `style` isteğe bağlıdır. Poz değişince SVG görseli değişir.

### `<Callout>`

`text`, `x`, `y` zorunlu; `title`, `icon`, `accentColor`, `backgroundColor`, `textColor` ve giriş animasyonu prop'ları isteğe bağlıdır.

### `<Arrow>`

`fromX`, `fromY`, `toX`, `toY` zorunlu; `label`, `color`, `strokeWidth`, `curvature` ve giriş animasyonu prop'ları isteğe bağlıdır.

### `<ZoomTo>`

`targetX`, `targetY`, `children` zorunlu; `scale`, `startFrame` ve `durationFrames` isteğe bağlıdır.

### `<ProgressBar>`

`position` (`top`/`bottom`), `height`, `color` ve `backgroundColor` isteğe bağlıdır.

### `<SafeAreaOverlay>`

`visible`, `platform`, `opacity`, `showInRender`, `className` ve `style` isteğe bağlıdır. `platform` etiketi değiştirir; tüm platformlar ortak, temkinli ölçüler kullanır. Kılavuzun çıktıda görünmesi için `visible` ve `showInRender` birlikte açılmalıdır.

## Kendi Seslendirmeniz (TTS) ve Whisper Kelime Zaman Damgalarını Kullanma

### 1. Seslendirmenin Üretilmesi (Örn. OpenAI TTS veya ElevenLabs)

Yerelde ürettiğiniz veya kullanım hakkına sahip olduğunuz seslendirmeyi kullanın. Ücretli servis gerekmez.

### 2. Whisper ile Kelime Seviyesinde Zaman Damgası Çıkarma

Yerel transkripsiyon akışınızdan gelen kelime zamanlarını kullanın. Kit, TTS veya transkripsiyon servisine istek göndermez. Whisper JSON dosyası `segments[].words`, üst düzey `words` veya doğrudan kelime dizisi içerebilir. Hem `word` hem `text` anahtarı kabul edilir. Zamanlar önceden sıralanmış ve çakışmasız olmalıdır.

### 3. Zaman Çizelgesi JSON'ına Entegre Etme

```bash
npm run build
node bin/shorts-kit.mjs words-to-timeline tests/fixtures/whisper.json --out out/timeline.json
node bin/shorts-kit.mjs validate out/timeline.json
```

Dönüştürücü, tek sahneli ve `Word[]` altyazılı geçerli bir timeline üretir. Sahne görsellerini düzenleyin; ses dosyanızı `public/` altına koyduktan sonra `audio: { "src": "narration.mp3" }` ekleyin. Pakette ses dosyası yoktur.

Remotion'ın `--props` seçeneği için timeline'ı `{ "timeline": ... }` içine alın. Örneğin, hazır timeline'ı genel kompozisyonla render edin:

```bash
node --input-type=module -e "import fs from 'node:fs'; fs.writeFileSync('out/props.json', JSON.stringify({timeline: JSON.parse(fs.readFileSync('examples/demo-timeline.json','utf8'))}));"
npx remotion render src/index.ts ExplainerShort out/custom.mp4 --props=out/props.json
```

Yerel ses/görsel yolları `public/` altında çözülür. Studio/CLI renderında dosya eksikse hata `public/<dosya>` yolunu belirtir. Public dosya listesi olmayan SSR/Player ortamlarında Remotion'ın URL çözümlemesi kullanılır. HTTP(S), data ve blob URL'leri aynen iletilir; dışarıdan içerik yükleyebilir.

## Dikey Video Güvenli Alan Standartları

1080×1920 tuvalde kritik içerik için üstte 200 px, altta 480 px, solda 60 px ve sağda 180 px ayırın. Altyazılar varsayılan olarak alttan 500 px yukarıdadır. Bu ölçüler temkinli bir kılavuzdur; platform arayüzleri değiştiği için yayımlamadan önce hedef platformda kontrol edin. Farklı tuval boyutlarında yerleşim değerlerini düzenleyin.

## Nasıl Çalışır?

Zod varsayılanları uygular ve zaman aralıklarını denetler. Kare zamanı, sahneyi ve altyazı grubunu seçer. React bileşenleri görselleri ve kareye bağlı hareketleri çizer; Remotion sonucu dışa aktarır. CLI çıktısı ve kütüphane bileşenleri aynı şemayı kullanır.

## Görseller ve Lisanslama

Pip ve projedeki SVG çizimleri özgün varlıklardır; [MIT](LICENSE) kapsamındadır. Telifli karakter, ses veya font dosyası paketlenmez; sistem fontları kullanılır. Üçüncü taraf bağımlılıkların kendi lisansları geçerlidir. Kullanımınıza göre [Remotion lisans koşullarını](https://www.remotion.dev/license) inceleyin.

## Sınırlamalar ve Gizlilik

Varsayılan koordinatlar 1080×1920 içindir. Seslendirme veya transkripsiyon motoru dahil değildir. Timeline ve CLI işlemleri yerelde çalışır; uzak görsel/ses URL'leri ilgili sunuculardan yüklenir. Hata bildirimlerinde yapay veri kullanın; paylaştığınız timeline'lara kişisel veri veya kimlik bilgisi koymayın.

## Proje Dizini

- `src/index.ts`, `src/Root.tsx`: Studio/CLI kaydı ve örnek kompozisyonlar.
- `src/library.ts`: bildirimleriyle birlikte `dist/` altına derlenen kütüphane girişi.
- `src/components/`, `src/helpers/`, `src/schema.ts`: tekrar kullanılabilir render ve doğrulama.
- `examples/`, `bin/`, `tests/`: timeline'lar, yerel CLI ve çevrimdışı testler.
- `docs/demo.gif`: gerçek demo kesiti; `out/` git tarafından yok sayılır.

## Geliştirme

```bash
npm run lint
npm run typecheck
npm test
npm run test -- --coverage
npm run build
npm pack --dry-run
npx remotion still src/index.ts ThermosExplainer out/still.png --frame=60
npx remotion compositions src/index.ts
```

CLI testleri için testlerden önce kütüphane derlenir. Vitest, her yardımcı/şema dosyasında statement, branch, function ve line coverage için en az %80 ister. CI, Node 20/22/24 ile Linux ve Windows'ta çalışır; Linux render-smoke karesini artifact olarak yükler.

## Katkıda Bulunma

[CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), [SECURITY.md](SECURITY.md) ve [CHANGELOG.md](CHANGELOG.md) dosyalarını okuyun. [Hata bildirimi](.github/ISSUE_TEMPLATE/bug_report.yml) veya [özellik isteği](.github/ISSUE_TEMPLATE/feature_request.yml) formunu kullanın; [PR kontrol listesini](.github/PULL_REQUEST_TEMPLATE.md) ve [bildirim yönlendirmesini](.github/ISSUE_TEMPLATE/config.yml) izleyin. [Dependabot](.github/dependabot.yml) npm ve Actions güncellemelerini haftalık kontrol eder. Yayınlar [etiket workflow'u](.github/workflows/publish.yml) ve npm trusted publishing ile yapılır.

## Lisans

[MIT](LICENSE). Copyright (c) 2026 Yusuf Berat Zengin.
