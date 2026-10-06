"""index.html の images/*.jpg を base64 で埋め込み、1ファイルで配れる HTML を dist/ に出力する。"""
import base64
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")


def inline(m):
    data = base64.b64encode((root / m.group(1)).read_bytes()).decode()
    return f'src="data:image/jpeg;base64,{data}"'


out = re.sub(r'src="(images/[^"]+\.jpg)"', inline, html)
dist = root / "dist"
dist.mkdir(exist_ok=True)
(dist / "paraestra-tanashi.html").write_text(out, encoding="utf-8")
print("wrote", dist / "paraestra-tanashi.html", len(out) // 1024, "KB")
