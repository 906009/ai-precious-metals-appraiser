import "./globals.css";

export const metadata = {
  title: "AI Precious Metals Appraiser",
  description: "MVP интерфейс онлайн-оценки ювелирных изделий"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <script
          src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=09633e72-6f29-4171-886c-5900593b4a45"
          type="text/javascript"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
