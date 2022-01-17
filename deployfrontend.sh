rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "comples assets for github pages"
git push -u website master

