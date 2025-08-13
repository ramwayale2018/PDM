// import { useEffect, useRef, useState } from 'react';
// import * as pdfjsLib from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker.entry';

// interface PdfViewerProps {
//   pdfUrl: string;
//   onClose: () => void;
// }

// const PdfViewer = ({ pdfUrl, onClose }: PdfViewerProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
//   const [rotation, setRotation] = useState(0);
//   const [scale, setScale] = useState(1.5);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [dragging, setDragging] = useState(false);
//   const dragStart = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     const loadPdf = async () => {
//       const loadingTask = pdfjsLib.getDocument(pdfUrl);
//       const pdf = await loadingTask.promise;
//       setPdfDoc(pdf);
//     };
//     loadPdf();
//   }, [pdfUrl]);

//   useEffect(() => {
//     const renderPage = async () => {
//       if (!pdfDoc || !canvasRef.current) return;
//       const page = await pdfDoc.getPage(1);
//       const viewport = page.getViewport({ scale, rotation });

//       const canvas = canvasRef.current;
//       const context = canvas.getContext('2d');
//       if (!context) return;

//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       context.clearRect(0, 0, canvas.width, canvas.height);

//       await page.render({ canvasContext: context, viewport }).promise;
//     };

//     renderPage();
//   }, [pdfDoc, scale, rotation]);

//   // Handle dragging
//   const handleMouseDown = (e: React.MouseEvent) => {
//     setDragging(true);
//     dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (dragging) {
//       setOffset({
//         x: e.clientX - dragStart.current.x,
//         y: e.clientY - dragStart.current.y,
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setDragging(false);
//   };

//   // Handle touch dragging
//   const handleTouchStart = (e: React.TouchEvent) => {
//     if (e.touches.length === 1) {
//       const touch = e.touches[0];
//       dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
//       setDragging(true);
//     }
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (dragging && e.touches.length === 1) {
//       const touch = e.touches[0];
//       setOffset({
//         x: touch.clientX - dragStart.current.x,
//         y: touch.clientY - dragStart.current.y,
//       });
//     }
//   };

//   const handleTouchEnd = () => {
//     setDragging(false);
//   };

//   // Handle scroll zoom
//   const handleWheel = (e: React.WheelEvent) => {
//     e.preventDefault();
//     if (e.deltaY < 0) {
//       setScale((s) => Math.min(s + 0.1, 4));
//     } else {
//       setScale((s) => Math.max(s - 0.1, 0.5));
//     }
//   };

//   return (
//     <div className="fixed top-0 left-[300px] right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
//       <div className="bg-white w-full h-full relative p-4">
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-6 text-4xl font-bold text-red-600 hover:text-gray-800 z-10"
//         >
//           &times;
//         </button>

//         {/* Controls */}
//         <div className="absolute top-4 left-6 z-10 flex gap-2">
//           <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} className="px-3 py-1 bg-gray-200 rounded">
//             Rotate Left
//           </button>
//           <button onClick={() => setRotation((r) => (r + 90) % 360)} className="px-3 py-1 bg-gray-200 rounded">
//             Rotate Right
//           </button>
//         </div>

//         {/* Viewer Container */}
//         <div
//           ref={containerRef}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//           onWheel={handleWheel}
//           className="w-full h-full overflow-hidden relative touch-none"
//         >
//           <canvas
//             ref={canvasRef}
//             style={{
//               transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
//               transformOrigin: 'top left',
//               cursor: dragging ? 'grabbing' : 'grab',
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PdfViewer;



import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

interface PdfViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const PdfViewer = ({ pdfUrl, onClose }: PdfViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const loadPdf = async () => {
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
    };
    loadPdf();
  }, [pdfUrl]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

      const page = await pdfDoc.getPage(1);

      const container = containerRef.current;
      const viewport = page.getViewport({ scale: 1 });

      const fitScale = Math.min(
        container.clientWidth / viewport.width,
        container.clientHeight / viewport.height
      );

      const actualScale = fitScale * scale;
      const finalViewport = page.getViewport({ scale: actualScale, rotation });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = finalViewport.width;
      canvas.height = finalViewport.height;
      context.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport: finalViewport }).promise;
    };

    renderPage();
  }, [pdfDoc, scale, rotation]);

  // Mouse drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  // Touch drag events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
      setDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragging && e.touches.length === 1) {
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - dragStart.current.x,
        y: touch.clientY - dragStart.current.y,
      });
    }
  };

  const handleTouchEnd = () => setDragging(false);

  // Zoom with Ctrl + Wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        setScale((prev) => Math.min(prev + 0.1, 4));
      } else {
        setScale((prev) => Math.max(prev - 0.1, 0.3));
      }
    }
  };

  return (
    <div className="fixed top-0 left-[300px] right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white w-full h-full relative p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-4xl font-bold text-red-600 hover:text-gray-800 z-10"
        >
          &times;
        </button>

        {/* Controls */}
        <div className="absolute top-4 left-6 z-10 flex gap-2">
          <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} className="px-3 py-1 bg-gray-200 rounded">
            Rotate Left
          </button>
          <button onClick={() => setRotation((r) => (r + 90) % 360)} className="px-3 py-1 bg-gray-200 rounded">
            Rotate Right
          </button>
        </div>

        {/* Viewer Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="w-full h-full overflow-auto relative"
        >
          <canvas
            ref={canvasRef}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transformOrigin: 'top left',
              cursor: dragging ? 'grabbing' : 'grab',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
