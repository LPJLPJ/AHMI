echo "begin generate local ide"

echo "start to empty tempFolder" &&
rm -rf tempFolder/ &&

echo "start to copy public , views and manifest.json  to tempFolder" &&
rsync -av -q --exclude blog/ --exclude download/ --exclude ide/modules/ide/js/ ../public tempFolder && 
rsync -av -q --exclude blog/ --exclude download/ ../views tempFolder &&
cp ../manifest.json tempFolder &&

echo "start to replace ejs pharse" &&
node emptyEJS.js &&

echo "start to zip update" &&
cd tempFolder && zip -q -r updFiles.zip * && mv updFiles.zip ../update/updFiles.zip && cd .. &&

echo "start to copy tempFolder to complete folder" && 
cp -rf tempFolder/* ./complete/IDENW/package.nw/ &&

echo "start to zip complete IDE" &&
cd ./complete && rm -rf localIDE.zip && cd IDENW && zip -q  -r ../localIDE.zip * && cd ../.. &&

echo "start to edit logs" &&
node editLogs.js &&

echo "finish all "
