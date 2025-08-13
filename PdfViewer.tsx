import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// Import from the legacy build, as you're using that
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; 
import { BASE_URL } from '../public/config.js'; // Adjust path if needed

// Use the correct worker source URL
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; // External CDN worker

const PdfViewer = () => {
  const { pdId } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchAndRenderPdf = async () => {
      try {
        const url = `${BASE_URL}api/open-cust-doc/${pdId}`;
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error('Failed to load PDF:', err);
      }
    };

    if (pdId) {
      fetchAndRenderPdf();
    }
  }, [pdId]);

  return (
    <div className="flex justify-center mt-8 overflow-auto">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default PdfViewer;
