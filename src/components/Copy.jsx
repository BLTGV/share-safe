export default function Copy (m) {
    const textArea = document.createElement("textarea");

    textArea.value = m;
    
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "0";
    textArea.style.height = "0";

    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();

    document.execCommand('copy');

    document.body.removeChild(textArea);
}