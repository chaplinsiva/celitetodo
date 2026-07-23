'use client';

export default function AdBanner({
  adKey = '69bcfc4fe4c608d7a0676856e33f3559',
  width = 160,
  height = 300,
  format = 'iframe',
  className = '',
}) {
  if (!adKey) return null;

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            overflow: hidden;
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : '${format}',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white/[0.02] border border-white/10 ${className}`}>
      <span className="text-[10px] text-text-muted mb-1 font-body uppercase tracking-wider">Sponsored</span>
      <iframe
        title={`Adsterra Ad ${adKey}`}
        srcDoc={srcDoc}
        width={width}
        height={height}
        className="border-0 overflow-hidden bg-transparent"
        scrolling="no"
      />
    </div>
  );
}
