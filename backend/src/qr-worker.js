import QRCode from 'https://cdn.skypack.dev/qrcode';

async function handleRequest(request) {
    const url = new URL(request.url);

    // Handle QR code generation
    if (url.pathname.startsWith("/generate")) {
        const params = url.searchParams;
        const qrText = params.get("url");

        if (!qrText) {
            return new Response("Missing URL", { status: 400 });
        }

        // Generate QR code as a base64 image
        const qrCode = await QRCode.toDataURL(qrText);
        return new Response(`<img src="${qrCode}">`, {
            headers: { "Content-Type": "text/html" },
        });
    }

    // Handle QR code redirection
    const qrID = url.pathname.split("/")[2]; // Assuming URL structure like /qr/12345
    const destinationUrl = await QR_KV.get(qrID); // Fetch URL from KV Store

    if (!destinationUrl) {
        return new Response("QR Code not found", { status: 404 });
    }

    return Response.redirect(destinationUrl, 302);
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});
