#!/usr/bin/env bash
# Build the venv and link `nanobanana` onto your PATH.
set -euo pipefail

here="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
target="${1:-$HOME/.local/bin}"

chmod +x "$here/bin/nanobanana"

python3 -m venv "$here/venv"
"$here/venv/bin/pip" install --quiet --upgrade pip
"$here/venv/bin/pip" install --quiet -r "$here/requirements.txt"

mkdir -p "$target"
ln -sf "$here/bin/nanobanana" "$target/nanobanana"

echo "Installed: $target/nanobanana -> $here/bin/nanobanana"
case ":$PATH:" in
  *":$target:"*) ;;
  *) echo "Note: $target is not on your PATH — add it in ~/.zshrc" ;;
esac
echo "Next: nanobanana --set-key YOUR_KEY   (get one at https://aistudio.google.com/apikey)"
