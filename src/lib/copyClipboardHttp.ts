export async function copyClipboard(texto: string) {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
        return;
    }

    const input = document.createElement("textarea");
    input.value = texto;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
}