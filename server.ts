import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Endpoint para descargar el archivo Excel reconstruido con Opción 1 y Opción 3
  app.get('/api/download/mapa-navegacion', (_req, res) => {
    const filePath = 'docs/fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(filePath, { root: process.cwd() });
  });

  // Endpoints para descargar los archivos oficiales XML WXR de importación a WordPress
  app.get('/api/download/wordpress-import-olas-0-1-2.xml', (_req, res) => {
    const filePath = 'docs/plantillas-wpbakery/wordpress-import-olas-0-1-2.xml';
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="wordpress-import-olas-0-1-2.xml"');
    res.sendFile(filePath, { root: process.cwd() });
  });

  app.get('/api/download/wordpress-import-completo-160.xml', (_req, res) => {
    const filePath = 'docs/plantillas-wpbakery/wordpress-import-completo-160.xml';
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="wordpress-import-completo-160.xml"');
    res.sendFile(filePath, { root: process.cwd() });
  });

  app.get('/api/download/wordpress-import-contribuyente-general-n3.xml', (_req, res) => {
    const filePath = 'docs/plantillas-wpbakery/wordpress-import-contribuyente-general-n3.xml';
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="wordpress-import-contribuyente-general-n3.xml"');
    res.sendFile(filePath, { root: process.cwd() });
  });

  app.get('/api/download/wordpress-import-contribuyente-general-completo.xml', (_req, res) => {
    const filePath = 'docs/plantillas-wpbakery/wordpress-import-contribuyente-general-completo.xml';
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', 'attachment; filename="wordpress-import-contribuyente-general-completo.xml"');
    res.sendFile(filePath, { root: process.cwd() });
  });

  // Servir archivos estáticos de descargas directas
  app.use('/downloads', express.static('public/downloads', {
    setHeaders: (res, path) => {
      if (path.endsWith('.xml')) {
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        const filename = path.split('/').pop();
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      }
    }
  }));

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
