export function openImageInNewTab(imageData: string, filename?: string) {
  const newWindow = window.open();
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>${filename || "Uploaded Image"}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .image-container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 90vw;
            }
            img {
              max-width: 100%;
              max-height: 80vh;
              border-radius: 4px;
              object-fit: contain;
            }
            .filename {
              margin-top: 10px;
              color: #666;
              font-size: 14px;
              word-break: break-all;
            }
            .close-button {
              position: absolute;
              top: 10px;
              right: 10px;
              background: #333;
              color: white;
              border: none;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              cursor: pointer;
              font-size: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .close-button:hover {
              background: #555;
            }
          </style>
        </head>
        <body>
          <button class="close-button" onclick="window.close()">×</button>
          <div class="image-container">
            <img src="${imageData}" alt="${filename || "Uploaded Image"}" />
            <div class="filename">${filename || "Uploaded Image"}</div>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
}
