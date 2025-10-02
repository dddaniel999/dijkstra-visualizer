export async function exportSvgRegionToPng(
  svg: SVGSVGElement,
  region: { x: number; y: number; w: number; h: number },
  dpiScale: number,
  filename: string
) {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  (clone.style as any).background = "none";

  clone.setAttribute(
    "viewBox",
    `${region.x} ${region.y} ${region.w} ${region.h}`
  );
  clone.setAttribute("width", `${region.w}px`);
  clone.setAttribute("height", `${region.h}px`);

  const svgData = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgData], { type: "image/svg+xml; charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(region.w * dpiScale));
    canvas.height = Math.max(1, Math.floor(region.h * dpiScale));

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    triggerDownload(canvas.toDataURL("image/png"), filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
