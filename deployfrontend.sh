rsync -r src/ docs/
rsync build/contracts/* docs/
git add .
git commit -m "compiles assets for github pages"
git push -u website master

