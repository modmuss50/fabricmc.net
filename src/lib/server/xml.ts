const escapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export function escapeXml(value: string) {
    return value.replace(/[&<>"']/g, character => escapes[character]);
}

export function xmlResponse(body: string) {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
